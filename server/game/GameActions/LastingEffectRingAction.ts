import { RingAction } from './RingAction.js';
import { Durations, EventNames } from '../Constants.js';
import { LastingEffectGeneralProperties } from './LastingEffectAction.js';

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

    eventHandler(event: any, additionalProperties: Record<string, unknown> = {}): void {
        let properties = this.getProperties(event.context, additionalProperties) as LastingEffectRingProperties;
        if(!properties.ability) {
            properties.ability = event.context.ability;
        }
        event.context.source[properties.duration ?? Durations.UntilEndOfConflict](() => Object.assign({ match: event.ring }, properties));
    }
}
