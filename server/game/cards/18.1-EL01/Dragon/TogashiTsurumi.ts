import { modifyBothSkills } from '../../../effects.js';
import { draw, multiple, placeCardUnderneath } from '../../../GameActions/GameActions.js';
import { CardType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { countCardsUnderneath, playableFromUnderneath } from '../../cardsUnderneath.js';
import { msg } from '../../../GameChat.js';

export default class TogashiTsurumi extends DrawCard {
    static id = 'togashi-tsurumi';

    public setupCardAbilities() {
        this.persistentEffect({
            effect: modifyBothSkills(() => countCardsUnderneath(this))
        });

        this.persistentEffect(playableFromUnderneath(this, (card) => card.hasTrait('kiho')));

        this.action('Place a card underneath self')
            .target({
                activePromptTitle: 'Choose a card',
                location: Location.Hand,
                controller: Players.Self,
                cardType: [CardType.Event, CardType.Attachment, CardType.Character]
            }, multiple([
                draw((context) => ({
                    target: context.player
                })),
                placeCardUnderneath((context) => ({ destination: context.source }))
            ]))
            .effect((context) => msg`place a card from their hand beneath ${context.source} and draw a card`);
    }
}
