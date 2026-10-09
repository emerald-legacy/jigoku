import { CardType, ConflictType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { perConflict } from '../../../AbilityLimit.js';
import { chosenDiscard, discardAtRandom } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class TalkWithTheServants extends DrawCard {
    static id = 'talk-with-the-servants';

    setupCardAbilities() {
        this.reaction('Force opponent to discard 2 cards')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player && event.conflict.conflictType === ConflictType.Political
            })
            .cost(costs.dishonor({
                optional: true,
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }))
            .if((context) => context.costs.dishonor instanceof DrawCard)
                .gameAction(discardAtRandom((context) => ({ amount: 2, target: context.player.opponent })))
            .otherwise()
                .gameAction(chosenDiscard((context) => ({ amount: 2, target: context.player.opponent })))
            .max(perConflict(1));
    }
}
