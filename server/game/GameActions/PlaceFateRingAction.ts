import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';
import type { ActionEvent } from './GameAction.js';
import type { AnyEvent } from '../TriggeredAbilityContext.js';

export interface PlaceFateRingProperties extends RingActionProperties {
    amount?: number;
    origin?: DrawCard | Player | Ring;
}

export class PlaceFateRingAction<C extends AbilityContext = AbilityContext> extends RingAction<PlaceFateRingProperties, EventName.OnMoveFate, C> {
    name = 'placeFate';
    eventName = EventName.OnMoveFate;
    defaultProperties: PlaceFateRingProperties = { amount: 1 };
    constructor(properties: ((context: C) => PlaceFateRingProperties) | PlaceFateRingProperties) {
        super(properties);
    }

    getCostMessage(context: C): MessageArgs {
        let properties: PlaceFateRingProperties = this.getProperties(context);
        return ['placing {1} fate on the {0}', [properties.amount, properties.target]];
    }

    getEffectMessage(context: C): MessageArgs {
        let properties: PlaceFateRingProperties = this.getProperties(context);
        if(properties.origin) {
            return ['move {1} fate from {2} to {0}', [properties.target, properties.amount, properties.origin]];
        }
        return ['place {1} fate on {0}', [properties.target, properties.amount]];
    }

    canAffect(ring: Ring, context: C, additionalProperties = {}): boolean {
        let properties: PlaceFateRingProperties = this.getProperties(context, additionalProperties);
        if(
            properties.origin &&
            (!properties.origin.checkRestrictions('spendFate', context) || properties.origin.fate === 0)
        ) {
            return false;
        }
        return (properties.amount ?? 0) > 0 && super.canAffect(ring, context);
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnMoveFate, C>, ring: Ring, context: C, additionalProperties: Record<string, unknown> = {}): void {
        let { amount, origin } = this.getProperties(context, additionalProperties);
        event.fate = amount ?? 0;
        event.origin = origin;
        event.context = context;
        event.recipient = ring;
    }

    checkEventCondition(event: ActionEvent<EventName.OnMoveFate, C>): boolean {
        return this.moveFateEventCondition(event);
    }

    isEventFullyResolved(event: AnyEvent, ring: Ring, context: C, additionalProperties: Record<string, unknown> = {}): boolean {
        let { amount, origin } = this.getProperties(context, additionalProperties);
        return (
            !event.cancelled &&
            event.name === this.eventName &&
            event.fate === amount &&
            event.origin === origin &&
            event.recipient === ring
        );
    }

    eventHandler(event: ActionEvent<EventName.OnMoveFate, C>): void {
        this.moveFateEventHandler(event);
    }
}
