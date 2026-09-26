import type { AbilityContext } from '../AbilityContext.js';
import { RingAction } from './RingAction.js';
import { Duration, EventName } from '../Constants.js';
import { LastingEffectGeneralProperties } from './LastingEffectAction.js';

import type { ActionEvent } from './GameAction.js';
export type LastingEffectRingProperties = LastingEffectGeneralProperties;

export class LastingEffectRingAction<C extends AbilityContext = AbilityContext> extends RingAction<LastingEffectRingProperties, EventName.OnEffectApplied, C> {
    name = 'applyLastingEffect';
    eventName = EventName.OnEffectApplied;
    effect = 'apply a lasting effect';
    defaultProperties: LastingEffectRingProperties = {
        duration: Duration.UntilEndOfConflict,
        effect: [],
        ability: undefined
    };

    eventHandler(event: ActionEvent<EventName.OnEffectApplied, C>, additionalProperties: Record<string, unknown> = {}): void {
        let properties = this.getProperties(event.context, additionalProperties);
        if(!properties.ability) {
            properties.ability = event.context.ability;
        }
        event.context.source.applyDurationEffect(properties.duration ?? Duration.UntilEndOfConflict, () => Object.assign({ match: event.ring }, properties));
    }
}
