import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import { RingAction } from './RingAction.js';
import { Duration, EventName } from '../Constants.js';
import type { LastingEffectGeneralProperties } from './LastingEffectAction.js';
import type { ActionEvent } from './GameAction.js';

export type LastingEffectRingProperties<Context extends AbilityContext = AbilityContext> = LastingEffectGeneralProperties<Context>;

export class RingLastingEffectAction<Context extends AbilityContext = AbilityContext> extends RingAction<LastingEffectRingProperties, EventName.OnEffectApplied, Context, 'duration' | 'effect'> {
    override name = 'ringLastingEffect';
    override eventName = EventName.OnEffectApplied;
    override effect = 'apply a lasting effect';
    override defaultProperties = {
        duration: Duration.UntilEndOfConflict,
        effect: []
    };

    override eventHandler(event: ActionEvent<EventName.OnEffectApplied, Context>, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(event.context, additionalProperties);
        if(!properties.ability) {
            properties.ability = event.context.ability;
        }
        event.context.source.applyDurationEffect(properties.duration, Object.assign({ match: event.ring }, properties));
    }
}
