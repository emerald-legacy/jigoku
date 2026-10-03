import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class SpiesAtCourt extends DrawCard {
    static id = 'spies-at-court';

    setupCardAbilities() {
        this.reaction('Force opponent to discard 2 cards')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.player && event.conflict.conflictType === 'political'
            })
            .cost(AbilityDsl.costs.dishonor({ cardType: CardType.Character, cardCondition: card => card.isParticipating() }))
            .gameAction(AbilityDsl.actions.discardAtRandom({ amount: 2 }))
            .max(AbilityDsl.limit.perConflict(1));
    }
}


export default SpiesAtCourt;
