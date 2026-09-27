import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class SpiesAtCourt extends DrawCard {
    static id = 'spies-at-court';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Force opponent to discard 2 cards')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.player && event.conflict.conflictType === 'political'
            })
            .cost(ability.costs.dishonor({ cardType: CardType.Character, cardCondition: card => card.isParticipating() }))
            .gameAction(ability.actions.discardAtRandom({ amount: 2 }))
            .max(ability.limit.perConflict(1));
    }
}


export default SpiesAtCourt;
