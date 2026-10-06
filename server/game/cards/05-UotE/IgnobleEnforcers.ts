import AbilityDsl from '../../abilitydsl.js';
import { placeFate } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

class IgnobleEnforcers extends DrawCard {
    static id = 'ignoble-enforcers';

    setupCardAbilities() {
        this.reaction('Place additional fate on this character')
            .when({
                onCardPlayed: (event, context) => event.card === context.source
            })
            .cost(AbilityDsl.costs.variableHonorCost(() => 3))
            .gameAction(placeFate((context) => ({ amount: context.costs.variableHonorCost })))
            .effect('place {1} fate on {0}', (context) => context.costs.variableHonorCost);
    }
}


export default IgnobleEnforcers;
