import { RingAction } from './RingAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import { Duration, EventName } from '../Constants.js';
import { LastingEffectGeneralProperties } from './LastingEffectAction.js';

import type { GameEvent } from '../Events/EventPayloads.js';
export type LastingEffectRingProperties = LastingEffectGeneralProperties;

export class LastingEffectRingAction extends RingAction {
    name = 'applyLastingEffect';
    eventName = EventName.OnEffectApplied;
    effect = 'apply a lasting effect';
    defaultProperties: LastingEffectRingProperties = {
        duration: Duration.UntilEndOfConflict,
        effect: [],
        ability: undefined
    };

    eventHandler(event: GameEvent<EventName.OnEffectApplied>, additionalProperties: Record<string, unknown> = {}): void {
        let properties = this.getProperties((event.context as AbilityContext), additionalProperties) as LastingEffectRingProperties;
        if(!properties.ability) {
            properties.ability = (event.context as AbilityContext).ability;
        }
        (event.context as AbilityContext).source.applyDurationEffect(properties.duration ?? Duration.UntilEndOfConflict, () => Object.assign({ match: (event as GameEvent<EventName.OnClaimRing>).ring }, properties));
    }
}
