import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { discardAtRandom } from '../../GameActions/GameActions.js';
import { CardType, ConflictType } from '../../Constants.js';

class SpiesAtCourt extends DrawCard {
    static id = 'spies-at-court';

    setupCardAbilities() {
        this.reaction('Force opponent to discard 2 cards')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.player && event.conflict.conflictType === ConflictType.Political
            })
            .cost(AbilityDsl.costs.dishonor({ cardType: CardType.Character, cardCondition: card => card.isParticipating() }))
            .gameAction(discardAtRandom({ amount: 2 }))
            .max(AbilityDsl.limit.perConflict(1));
    }
}


export default SpiesAtCourt;
