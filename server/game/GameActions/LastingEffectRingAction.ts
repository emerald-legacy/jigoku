import type { AbilityContext } from '../AbilityContext.js';
import { RingAction } from './RingAction.js';
import { Duration, EventName } from '../Constants.js';
import type { LastingEffectGeneralProperties } from './LastingEffectAction.js';
import type { ActionEvent } from './GameAction.js';

export type LastingEffectRingProperties = LastingEffectGeneralProperties;

export class LastingEffectRingAction<C extends AbilityContext = AbilityContext> extends RingAction<LastingEffectRingProperties, EventName.OnEffectApplied, C, 'duration' | 'effect'> {
    name = 'applyLastingEffect';
    eventName = EventName.OnEffectApplied;
    effect = 'apply a lasting effect';
    defaultProperties = {
        duration: Duration.UntilEndOfConflict,
        effect: []
    };

    eventHandler(event: ActionEvent<EventName.OnEffectApplied, C>, additionalProperties: Record<string, unknown> = {}): void {
        const properties = this.getProperties(event.context, additionalProperties);
        if(!properties.ability) {
            properties.ability = event.context.ability;
        }
        event.context.source.applyDurationEffect(properties.duration, () => Object.assign({ match: event.ring }, properties));
    }
}
