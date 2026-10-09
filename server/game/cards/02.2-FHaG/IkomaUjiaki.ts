import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Location, Players, TargetMode, CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { putIntoConflict, reveal, selectCards, sequential } from '../../GameActions/GameActions.js';

class IkomaUjiaki extends DrawCard {
    static id = 'ikoma-ujiaki';

    setupCardAbilities() {
        this.action('Put characters into play')
            .cost(costs.discardImperialFavor())
            .condition((context) => context.source.isParticipating())
            .gameAction(sequential([
                reveal((context) => ({
                    target: context.player.getDynastyCardsInProvince(Location.Provinces)
                })),
                selectCards((context) => ({
                    activePromptTitle: 'Choose up to two characters',
                    numCards: 2,
                    targets: true,
                    mode: TargetMode.UpTo,
                    optional: true,
                    cardType: CardType.Character,
                    location: [Location.Provinces],
                    controller: Players.Self,
                    cardCondition: (card) => card.isFaceup() && card.allowGameAction('putIntoConflict', context),
                    message: (context, cards) => msg`${context.player} puts ${cards} into play into the conflict`,
                    gameAction: putIntoConflict()
                }))
            ]))
            .chatText('reveal their dynasty cards and put up to two of them into play');
    }
}


export default IkomaUjiaki;
