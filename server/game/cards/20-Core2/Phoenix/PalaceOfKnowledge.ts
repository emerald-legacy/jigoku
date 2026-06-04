import type { AbilityContext } from '../../../AbilityContext.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import { EventName, TargetMode } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import type Ring from '../../../Ring.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
export default class PalaceOfKnowledge extends StrongholdCard {
    static id = 'palace-of-knowledge';

    setupCardAbilities() {
        this.reaction({
            title: 'Resolve another ring effect',
            when: {
                onResolveRingElement: (event: EventPayload<EventName.OnResolveRingElement>, context) =>
                    event.player === context.player && event.effectivellyResolvedEffect
            },
            cost: [AbilityDsl.costs.bowSelf(), AbilityDsl.costs.discardCard()],
            target: {
                mode: TargetMode.Ring,
                activePromptTitle: 'Choose a ring',
                ringCondition: (ring: Ring, context?: AbilityContext) =>
                    ring !== (context as TriggeredAbilityContext | undefined)?.event.ring && ring.isUnclaimed(),
                gameAction: AbilityDsl.actions.resolveRingEffect()
            }
        });
    }
}
