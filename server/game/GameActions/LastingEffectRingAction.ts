import { RingAction } from './RingAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import { Durations, EventNames } from '../Constants.js';
import { LastingEffectGeneralProperties } from './LastingEffectAction.js';

import type { GameEvent } from '../Events/EventPayloads.js';
export type LastingEffectRingProperties = LastingEffectGeneralProperties;

export class LastingEffectRingAction extends RingAction {
    name = 'applyLastingEffect';
    eventName = EventNames.OnEffectApplied;
    effect = 'apply a lasting effect';
    defaultProperties: LastingEffectRingProperties = {
        duration: Durations.UntilEndOfConflict,
        effect: [],
        ability: undefined
    };

    eventHandler(event: GameEvent<EventNames.OnEffectApplied>, additionalProperties: Record<string, unknown> = {}): void {
        let properties = this.getProperties((event.context as AbilityContext), additionalProperties) as LastingEffectRingProperties;
        if(!properties.ability) {
            properties.ability = (event.context as AbilityContext).ability;
        }
        (event.context as AbilityContext).source[properties.duration ?? Durations.UntilEndOfConflict](() => Object.assign({ match: (event as GameEvent<EventNames.OnClaimRing>).ring }, properties));
    }
}
