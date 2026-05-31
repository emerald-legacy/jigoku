import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventNames } from '../../Constants.js';
class IgnobleEnforcers extends DrawCard {
    static id = 'ignoble-enforcers';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Place additional fate on this character',
            when: {
                onCardPlayed: (event: EventPayload<EventNames.OnCardPlayed>, context: any) => event.card === context.source
            },
            cost: ability.costs.variableHonorCost(() => 3),
            effect: 'place {1} fate on {0}',
            effectArgs: (context: any) => context.costs.variableHonorCost,
            gameAction: ability.actions.placeFate((context: any) => ({ amount: context.costs.variableHonorCost }))
        });
    }
}


export default IgnobleEnforcers;
