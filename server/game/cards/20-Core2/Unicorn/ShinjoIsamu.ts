import { EventName } from '../../../Constants.js';
import { resolveRingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
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
        this.reaction('Resolve a ring effect')
            .when({
                onSendHome: isamuWentHome,
                onReturnHome: isamuWentHome
            })
            .ringTarget({
                activePromptTitle: 'Choose a ring',
                ringCondition: (ring, context) =>
                    context.game.requireConflict()
                        .getConflictProvinces()
                        .some((province) => province.getElement().includes(ring.element))
            }, resolveRingEffect())
            .effect('resolve the {0} effect');
    }
}
