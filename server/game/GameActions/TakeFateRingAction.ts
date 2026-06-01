import type { AbilityContext } from '../AbilityContext.js';
import { EventNames } from '../Constants.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';

export interface TakeFateRingProperties extends RingActionProperties {
    amount?: number;
    removeOnly?: boolean;
}

export class TakeFateRingAction extends RingAction {
    name = 'takeFate';
    eventName = EventNames.OnMoveFate;
    defaultProperties: TakeFateRingProperties = { amount: 1, removeOnly: false };
    constructor(properties: ((context: AbilityContext) => TakeFateRingProperties) | TakeFateRingProperties) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        let properties = this.getProperties(context) as TakeFateRingProperties;
        return [
            '{2} {1} fate from {0}',
            [properties.target, properties.amount, properties.removeOnly ? 'remove' : 'take']
        ];
    }

    canAffect(ring: Ring, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as TakeFateRingProperties;
        return (
            context.player.checkRestrictions('takeFateFromRings', context) &&
            ring.fate > 0 &&
            (properties.amount ?? 0) > 0 &&
            super.canAffect(ring, context)
        );
    }

    addPropertiesToEvent(event: GameEvent<EventNames.OnMoveFate>, ring: Ring, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let properties = this.getProperties(context, additionalProperties) as TakeFateRingProperties;
        event.fate = properties.amount ?? 0;
        event.origin = ring;
        event.context = context;
        event.recipient = properties.removeOnly ? undefined : context.player;
    }

    checkEventCondition(event: GameEvent<EventNames.OnMoveFate>): boolean {
        return this.moveFateEventCondition(event);
    }

    isEventFullyResolved(event: GameEvent<EventNames.OnMoveFate>, ring: Ring, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): boolean {
        let { amount } = this.getProperties(context, additionalProperties) as TakeFateRingProperties;
        return (
            !event.cancelled &&
            event.name === this.eventName &&
            event.fate === amount &&
            event.origin === ring &&
            event.recipient === context.player
        );
    }

    eventHandler(event: GameEvent<EventNames.OnMoveFate>): void {
        this.moveFateEventHandler(event);
    }
}
