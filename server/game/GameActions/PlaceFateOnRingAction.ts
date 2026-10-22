import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName, RestrictionType } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';
import type { ActionEvent } from './GameAction.js';
import type { AnyEvent } from '../TriggeredAbilityContext.js';
import { canMoveFateFrom } from './Shared/FateOrigin.js';

export interface PlaceFateRingProperties extends RingActionProperties {
    amount?: number;
    origin?: DrawCard | Player | Ring;
    /** The fate is spent from the origin's fate pool. */
    spend?: boolean;
}

export class PlaceFateOnRingAction<Context extends AbilityContext = AbilityContext> extends RingAction<PlaceFateRingProperties, EventName.OnMoveFate, Context, 'amount'> {
    override name = 'placeFateOnRing';
    override restriction = RestrictionType.PlaceFate;
    override eventName = EventName.OnMoveFate;
    override defaultProperties = { amount: 1 };
    override getCostMessage(context: Context): MessageArgs {
        const properties = this.getProperties(context);
        return ['placing {1} fate on the {0}', [properties.amount]];
    }

    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        const properties = this.getProperties(context, additionalProperties);
        if(properties.origin) {
            return ['move {1} fate from {2} to {0}', [properties.amount, properties.origin]];
        }
        return ['place {1} fate on {0}', [properties.amount]];
    }

    override canAffect(ring: Ring, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.amount > 0 && canMoveFateFrom(properties.origin, context, { spend: properties.spend }) && super.canAffect(ring, context);
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnMoveFate, Context>, ring: Ring, context: Context, additionalProperties: ActionOverrides = {}): void {
        const { amount, origin, spend } = this.getProperties(context, additionalProperties);
        event.fate = amount;
        event.origin = origin;
        event.spend = spend;
        event.context = context;
        event.recipient = ring;
    }

    override checkEventCondition(event: ActionEvent<EventName.OnMoveFate, Context>): boolean {
        return this.moveFateEventCondition(event);
    }

    override isEventFullyResolved(event: AnyEvent, ring: Ring, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const { origin } = this.getProperties(context, additionalProperties);
        return (
            !event.cancelled &&
            event.name === this.eventName &&
            event.origin === origin &&
            event.recipient === ring
        );
    }

    override eventHandler(event: ActionEvent<EventName.OnMoveFate, Context>): void {
        this.moveFateEventHandler(event);
    }
}
