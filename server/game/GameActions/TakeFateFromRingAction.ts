import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName, RestrictionType } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';
import type { ActionEvent } from './GameAction.js';
import type { AnyEvent } from '../TriggeredAbilityContext.js';

export interface TakeFateRingProperties extends RingActionProperties {
    amount?: number;
    removeOnly?: boolean;
}

export class TakeFateFromRingAction<Context extends AbilityContext = AbilityContext> extends RingAction<TakeFateRingProperties, EventName.OnMoveFate, Context, 'amount' | 'removeOnly'> {
    override name = 'takeFateFromRing';
    override eventName = EventName.OnMoveFate;
    override defaultProperties = { amount: 1, removeOnly: false };
    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        const properties = this.getProperties(context, additionalProperties);
        return ['{2} {1} fate from {0}', [properties.amount, properties.removeOnly ? 'remove' : 'take']];
    }

    override canAffect(ring: Ring, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return (
            context.player.checkRestrictions(RestrictionType.TakeFateFromRings, context) &&
            ring.fate > 0 &&
            properties.amount > 0 &&
            super.canAffect(ring, context)
        );
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnMoveFate, Context>, ring: Ring, context: Context, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        event.fate = properties.amount;
        event.origin = ring;
        event.context = context;
        event.recipient = properties.removeOnly ? undefined : context.player;
    }

    override checkEventCondition(event: ActionEvent<EventName.OnMoveFate, Context>): boolean {
        return this.moveFateEventCondition(event);
    }

    override isEventFullyResolved(event: AnyEvent, ring: Ring, context: Context): boolean {
        return (
            !event.cancelled &&
            event.name === this.eventName &&
            event.origin === ring &&
            event.recipient === context.player
        );
    }

    override eventHandler(event: ActionEvent<EventName.OnMoveFate, Context>): void {
        this.moveFateEventHandler(event);
    }
}
