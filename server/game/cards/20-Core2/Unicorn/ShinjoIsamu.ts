import { EventName, TargetMode } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import type { Conflict } from '../../../Conflict.js';
import DrawCard from '../../../DrawCard.js';
import type Ring from '../../../Ring.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import type { ProvinceCard } from '../../../ProvinceCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';

type SendOrReturnHomeEvent =
    | EventPayload<EventName.OnSendHome>
    | EventPayload<EventName.OnReturnHome>;

function isamuWentHome(event: SendOrReturnHomeEvent, context: TriggeredAbilityContext<ShinjoIsamu>) {
    return event.card === context.source;
}

export default class ShinjoIsamu extends DrawCard {
    static id = 'shinjo-isamu';

    setupCardAbilities() {
        this.reaction({
            title: 'Resolve a ring effect',
            when: {
                onSendHome: isamuWentHome,
                onReturnHome: isamuWentHome
            },
            target: {
                mode: TargetMode.Ring,
                activePromptTitle: 'Choose a ring',
                ringCondition: (ring: Ring, context?: AbilityContext) =>
                    (context?.game.currentConflict as Conflict)
                        .getConflictProvinces()
                        .some((province: ProvinceCard) => province.getElement().includes(ring.element)),
                gameAction: AbilityDsl.actions.resolveRingEffect()
            },
            effect: 'resolve the {0} effect'
        });
    }
}
