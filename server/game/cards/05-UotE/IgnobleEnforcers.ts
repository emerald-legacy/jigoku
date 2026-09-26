import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class IgnobleEnforcers extends DrawCard {
    static id = 'ignoble-enforcers';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Place additional fate on this character')
            .when({
                onCardPlayed: (event: EventPayload<EventName.OnCardPlayed>, context) => event.card === context.source
            })
            .cost(ability.costs.variableHonorCost(() => 3))
            .gameAction(ability.actions.placeFate((context) => ({ amount: context.costs.variableHonorCost })))
            .effect('place {1} fate on {0}', (context) => context.costs.variableHonorCost);
    }
}


export default IgnobleEnforcers;
