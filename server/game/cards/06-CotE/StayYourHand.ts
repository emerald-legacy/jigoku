import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class StayYourHand extends DrawCard {
    static id = 'stay-your-hand';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel a duel')
            .when({
                onDuelInitiated: (event: EventPayload<EventName.OnDuelInitiated>, context: AbilityContext) =>
                    !!event.context &&
                    event.context.player === context.player.opponent &&
                    (Object.values(event.context.targets).some((card) => (card as BaseCard).controller === context.player) ||
                    (event.context.targets.target && Object.values(event.context.targets.target).some((card) => card.controller === context.player)))
            })
            .handler((context) => context.cancel())
            .effect('cancel the duel originating from {1}', (context) => context.event.context.source)
            .cannotBeMirrored();
    }
}


export default StayYourHand;
