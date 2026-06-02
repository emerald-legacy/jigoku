import type { AbilityContext } from '../AbilityContext.js';
import type BaseAbility from '../BaseAbility.js';
import { Duration, EventName, Players } from '../Constants.js';
import type { WhenType } from '../Interfaces.js';
import type Player from '../Player.js';
import { GameAction, type GameActionProperties } from './GameAction.js';

import type { Event } from '../Events/Event.js';
export interface LastingEffectGeneralProperties extends GameActionProperties {
    duration?: Duration;
    condition?: (context: AbilityContext) => boolean;
    until?: WhenType;
    effect?: any;
    message?: string;
    ability?: BaseAbility;
}

export interface LastingEffectProperties extends LastingEffectGeneralProperties {
    targetController?: Players | Player;
}

export class LastingEffectAction<P extends LastingEffectProperties = LastingEffectProperties> extends GameAction<P> {
    name = 'applyLastingEffect';
    eventName = EventName.OnEffectApplied;
    effect = 'apply a lasting effect';
    // @ts-expect-error -- intentionally narrowing defaultProperties type from base class generic P to LastingEffectProperties
    defaultProperties: LastingEffectProperties = {
        duration: Duration.UntilEndOfConflict,
        effect: [],
        ability: undefined
    } as LastingEffectProperties;

    // @ts-expect-error -- overriding return type to be more specific than base class signature
    getProperties(
        context: AbilityContext,
        additionalProperties = {}
    ): LastingEffectProperties & { effect: Array<any> } {
        let properties = super.getProperties(context, additionalProperties) as LastingEffectProperties & {
            effect: Array<any>;
        };
        if(!Array.isArray(properties.effect)) {
            properties.effect = [properties.effect];
        }
        return properties;
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.effect.length > 0;
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties: Record<string, unknown>): void {
        if(this.hasLegalTarget(context, additionalProperties)) {
            events.push(this.getEvent(null, context, additionalProperties));
        }
    }

    eventHandler(event: Event, additionalProperties: Record<string, unknown>): void {
        let properties = this.getProperties((event.context as AbilityContext), additionalProperties);
        if(!properties.ability) {
            properties.ability = (event.context as AbilityContext).ability;
        }
        (event.context as AbilityContext).source[properties.duration ?? Duration.UntilEndOfConflict](() => properties);
    }
}
