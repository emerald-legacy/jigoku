import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName, RestrictionType } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';
import type { ActionEvent } from './GameAction.js';
import type { AnyEvent } from '../TriggeredAbilityContext.js';

export interface PlaceFateRingProperties extends RingActionProperties {
    amount?: number;
    origin?: DrawCard | Player | Ring;
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
        if(
            properties.origin &&
            (!properties.origin.checkRestrictions(RestrictionType.SpendFate, context) || properties.origin.fate === 0)
        ) {
            return false;
        }
        // moving fate off a ring removes it from that ring (The Stone of Sorrows)
        if(properties.origin instanceof Ring && !context.player.checkRestrictions(RestrictionType.TakeFateFromRings, context)) {
            return false;
        }
        return properties.amount > 0 && super.canAffect(ring, context);
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnMoveFate, Context>, ring: Ring, context: Context, additionalProperties: ActionOverrides = {}): void {
        const { amount, origin } = this.getProperties(context, additionalProperties);
        event.fate = amount;
        event.origin = origin;
        event.context = context;
        event.recipient = ring;
    }

    override checkEventCondition(event: ActionEvent<EventName.OnMoveFate, Context>): boolean {
        return this.moveFateEventCondition(event);
    }

    override isEventFullyResolved(event: AnyEvent, ring: Ring, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const { amount, origin } = this.getProperties(context, additionalProperties);
        return (
            !event.cancelled &&
            event.name === this.eventName &&
            event.fate === amount &&
            event.origin === origin &&
            event.recipient === ring
        );
    }

    override eventHandler(event: ActionEvent<EventName.OnMoveFate, Context>): void {
        this.moveFateEventHandler(event);
    }
}
