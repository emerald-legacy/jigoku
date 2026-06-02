import type { AbilityContext } from '../../AbilityContext.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class StayYourHand extends DrawCard {
    static id = 'stay-your-hand';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel a duel',
            when: {
                onDuelInitiated: (event: EventPayload<EventName.OnDuelInitiated>, context: AbilityContext) =>
                    !!event.context &&
                    event.context.player === context.player.opponent &&
                    (Object.values(event.context.targets).some((card: any) => card.controller === context.player) ||
                    (event.context.targets.target && Object.values(event.context.targets.target).some((card: any) => card.controller === context.player)))
            },
            cannotBeMirrored: true,
            effect: 'cancel the duel originating from {1}',
            effectArgs: (context: AbilityContext) => ((context as TriggeredAbilityContext).event.context as AbilityContext).source,
            handler: (context: AbilityContext) => (context as TriggeredAbilityContext).cancel()
        });
    }
}


export default StayYourHand;
