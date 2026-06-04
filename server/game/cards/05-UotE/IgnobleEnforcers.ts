import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class IgnobleEnforcers extends DrawCard {
    static id = 'ignoble-enforcers';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Place additional fate on this character',
            when: {
                onCardPlayed: (event: EventPayload<EventName.OnCardPlayed>, context) => event.card === context.source
            },
            cost: ability.costs.variableHonorCost(() => 3),
            effect: 'place {1} fate on {0}',
            effectArgs: (context: AbilityContext) => context.costs.variableHonorCost as number,
            gameAction: ability.actions.placeFate((context: AbilityContext) => ({ amount: context.costs.variableHonorCost as number }))
        });
    }
}


export default IgnobleEnforcers;
