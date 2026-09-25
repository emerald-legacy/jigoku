import { RingAction } from './RingAction.js';
import { Duration, EventName } from '../Constants.js';
import { LastingEffectGeneralProperties } from './LastingEffectAction.js';

import type { GameEvent } from '../Events/EventPayloads.js';
export type LastingEffectRingProperties = LastingEffectGeneralProperties;

export class LastingEffectRingAction extends RingAction<LastingEffectRingProperties> {
    name = 'applyLastingEffect';
    eventName = EventName.OnEffectApplied;
    effect = 'apply a lasting effect';
    defaultProperties: LastingEffectRingProperties = {
        duration: Duration.UntilEndOfConflict,
        effect: [],
        ability: undefined
    };

    eventHandler(event: GameEvent<EventName.OnEffectApplied>, additionalProperties: Record<string, unknown> = {}): void {
        let properties = this.getProperties((event.context), additionalProperties);
        if(!properties.ability) {
            properties.ability = (event.context).ability;
        }
        (event.context).source.applyDurationEffect(properties.duration ?? Duration.UntilEndOfConflict, () => Object.assign({ match: (event as GameEvent<EventName.OnClaimRing>).ring }, properties));
    }
}
