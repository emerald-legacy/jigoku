import DrawCard from '../../DrawCard.js';
import { canPlayFromOwn } from '../../effects.js';
import { moveCard, ready } from '../../GameActions/GameActions.js';
import { Location, PlayType, TargetMode, CardType, Players } from '../../Constants.js';

class RightHandOfTheEmperor extends DrawCard {
    static id = 'right-hand-of-the-emperor';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.player.opponent !== undefined && context.player.isMoreHonorable(),
            location: Location.ConflictDiscardPile,
            effect: canPlayFromOwn(Location.ConflictDiscardPile, [this], this, PlayType.Other)
        });
        this.action('Ready characters')
            .targetCards({
                mode: TargetMode.MaxStat,
                activePromptTitle: 'Choose characters',
                cardStat: (card) => card.getCost() ?? 0,
                maxStat: () => 6,
                numCards: 0,
                optional: true,
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('bushi')
            }, ready())
            .gameAction(moveCard((context) => ({
                target: context.source,
                destination: Location.ConflictDeck,
                bottom: true
            })))
            .chatText('ready {0}{1}. {2} is placed on the bottom of {3}\'s conflict deck', (context) => [context.targets.target.length > 0 ? '' : 'no one', context.source, context.source.owner]);
    }
}


export default RightHandOfTheEmperor;
