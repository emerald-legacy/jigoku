import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';
import type { ActionEvent } from './GameAction.js';

export interface TakeFateRingProperties extends RingActionProperties {
    amount?: number;
    removeOnly?: boolean;
}

export class TakeFateRingAction<C extends AbilityContext = AbilityContext> extends RingAction<TakeFateRingProperties, EventName, C> {
    name = 'takeFate';
    eventName = EventName.OnMoveFate;
    defaultProperties: TakeFateRingProperties = { amount: 1, removeOnly: false };
    constructor(properties: ((context: C) => TakeFateRingProperties) | TakeFateRingProperties) {
        super(properties);
    }

    getEffectMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        return [
            '{2} {1} fate from {0}',
            [properties.target, properties.amount, properties.removeOnly ? 'remove' : 'take']
        ];
    }

    canAffect(ring: Ring, context: C, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return (
            context.player.checkRestrictions('takeFateFromRings', context) &&
            ring.fate > 0 &&
            (properties.amount ?? 0) > 0 &&
            super.canAffect(ring, context)
        );
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnMoveFate, C>, ring: Ring, context: C, additionalProperties: Record<string, unknown> = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        event.fate = properties.amount ?? 0;
        event.origin = ring;
        event.context = context;
        event.recipient = properties.removeOnly ? undefined : context.player;
    }

    checkEventCondition(event: ActionEvent<EventName.OnMoveFate, C>): boolean {
        return this.moveFateEventCondition(event);
    }

    isEventFullyResolved(event: ActionEvent<EventName.OnMoveFate, C>, ring: Ring, context: C, additionalProperties: Record<string, unknown> = {}): boolean {
        let { amount } = this.getProperties(context, additionalProperties);
        return (
            !event.cancelled &&
            event.name === this.eventName &&
            event.fate === amount &&
            event.origin === ring &&
            event.recipient === context.player
        );
    }

    eventHandler(event: ActionEvent<EventName.OnMoveFate, C>): void {
        this.moveFateEventHandler(event);
    }
}
