import type { AbilityContext } from '../AbilityContext.js';
import type BaseAbility from '../BaseAbility.js';
import { Duration, EventName, Players } from '../Constants.js';
import type { WhenType } from '../Interfaces.js';
import type Player from '../Player.js';
import { GameAction, type ActionEvent, type GameActionProperties } from './GameAction.js';

import type { Event } from '../Events/Event.js';
import type { EffectFactory } from '../Effects/EffectBuilder.js';

/** The lasting-effect fields, shared by the player, card and ring variants. */
export interface LastingEffectFields {
    duration?: Duration;
    condition?: (context: AbilityContext) => boolean;
    until?: WhenType;
    effect?: EffectFactory | EffectFactory[];
    message?: string;
    ability?: BaseAbility;
}

export interface LastingEffectGeneralProperties extends GameActionProperties, LastingEffectFields {}

/** A single effect factory becomes a one-element list; a missing one becomes an empty list. */
export function toEffectList(effect: EffectFactory | EffectFactory[] | undefined): EffectFactory[] {
    if(effect === undefined) {
        return [];
    }
    return Array.isArray(effect) ? effect : [effect];
}

export interface LastingEffectProperties extends LastingEffectGeneralProperties {
    targetController?: Players | Player;
}

export class LastingEffectAction<C extends AbilityContext = AbilityContext> extends GameAction<LastingEffectProperties, EventName, C> {
    name = 'applyLastingEffect';
    eventName = EventName.OnEffectApplied;
    effect = 'apply a lasting effect';
    defaultProperties: Partial<LastingEffectProperties> = {
        duration: Duration.UntilEndOfConflict
    };

    getProperties(context: C, additionalProperties = {}): LastingEffectProperties & { effect: EffectFactory[] } {
        const properties = super.getProperties(context, additionalProperties);
        return Object.assign(properties, { effect: toEffectList(properties.effect) });
    }

    hasLegalTarget(context: C, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.effect.length > 0;
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: Record<string, unknown>): void {
        if(this.hasLegalTarget(context, additionalProperties)) {
            events.push(this.getEvent(null, context, additionalProperties));
        }
    }

    eventHandler(event: ActionEvent<EventName, C>, additionalProperties: Record<string, unknown>): void {
        let properties = this.getProperties(event.context, additionalProperties);
        if(!properties.ability) {
            properties.ability = event.context.ability;
        }
        event.context.source.applyDurationEffect(properties.duration ?? Duration.UntilEndOfConflict, () => properties);
    }
}
