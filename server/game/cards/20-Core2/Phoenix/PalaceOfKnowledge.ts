import { EventName } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import AbilityDsl from '../../../abilitydsl.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
export default class PalaceOfKnowledge extends StrongholdCard {
    static id = 'palace-of-knowledge';

    setupCardAbilities() {
        this.reaction('Resolve another ring effect')
            .when({
                onResolveRingElement: (event: EventPayload<EventName.OnResolveRingElement>, context) =>
                    event.player === context.player && event.effectivellyResolvedEffect
            })
            .cost(AbilityDsl.costs.bowSelf())
            .cost(AbilityDsl.costs.discardCard())
            .ringTarget('target', {
                activePromptTitle: 'Choose a ring',
                ringCondition: (ring, context) =>
                    ring !== context?.event.ring && ring.isUnclaimed()
            }, AbilityDsl.actions.resolveRingEffect());
    }
}
