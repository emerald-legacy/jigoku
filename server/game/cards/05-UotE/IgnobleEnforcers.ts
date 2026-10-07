import * as costs from '../../costs/index.js';
import DrawCard from '../../DrawCard.js';

class IgnobleEnforcers extends DrawCard {
    static id = 'ignoble-enforcers';

    setupCardAbilities() {
        this.reaction('Place additional fate on this character')
            .when({
                onCardPlayed: (event, context) => event.card === context.source
            })
            .cost(costs.variableHonorCost(() => 3))
            .placeFate((context) => ({ amount: context.costs.variableHonorCost }))
            .effect('place {1} fate on {0}', (context) => context.costs.variableHonorCost);
    }
}


export default IgnobleEnforcers;
