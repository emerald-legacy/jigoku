import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName, Location, RestrictionType } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';
import type { AnyEvent } from '../TriggeredAbilityContext.js';

export interface RemoveFateProperties extends CardActionProperties {
    amount?: number;
    recipient?: DrawCard | Player | Ring;
}

export class RemoveFateAction<Context extends AbilityContext = AbilityContext> extends CardGameAction<RemoveFateProperties, EventName.OnMoveFate, Context, 'amount'> {
    override name = 'removeFate';
    override restriction = RestrictionType.RemoveFate;
    override eventName = EventName.OnMoveFate;
    override targetType = [CardType.Character];
    override defaultProperties = { amount: 1 };
    override getCostMessage(context: Context): MessageArgs {
        const properties = this.getProperties(context);
        return ['removing {1} fate from {0}', [properties.amount]];
    }

    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        return ['remove {1} fate from {0}', [this.getProperties(context, additionalProperties).amount]];
    }

    override canAffect(card: BaseCard, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        if(properties.amount === 0 || card.location !== Location.PlayArea || card.getFate() === 0) {
            return false;
        }
        return super.canAffect(card, context) && this.checkRecipient(properties.recipient, context);
    }

    checkRecipient(origin: Player | Ring | DrawCard | undefined, context: Context): boolean {
        if(origin) {
            if(['player', 'ring'].includes(origin.type)) {
                return true;
            }
            return origin.allowGameAction('placeFate', context);
        }
        return true;
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnMoveFate, Context>, card: DrawCard, context: Context, additionalProperties: ActionOverrides = {}): void {
        const { amount, recipient } = this.getProperties(context, additionalProperties);
        event.fate = amount;
        event.recipient = recipient;
        event.origin = card;
        event.context = context;
    }

    override checkEventCondition(event: ActionEvent<EventName.OnMoveFate, Context>): boolean {
        return this.moveFateEventCondition(event);
    }

    override isEventFullyResolved(event: AnyEvent, card: BaseCard, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const { amount, recipient } = this.getProperties(context, additionalProperties);
        return (
            !event.cancelled &&
            event.name === this.eventName &&
            event.fate === amount &&
            event.origin === card &&
            event.recipient === recipient
        );
    }

    override eventHandler(event: ActionEvent<EventName.OnMoveFate, Context>): void {
        this.moveFateEventHandler(event);
    }
}
