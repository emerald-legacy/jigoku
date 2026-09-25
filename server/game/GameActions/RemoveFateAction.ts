import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export interface RemoveFateProperties extends CardActionProperties {
    amount?: number;
    recipient?: DrawCard | Player | Ring;
}

export class RemoveFateAction<C extends AbilityContext = AbilityContext> extends CardGameAction<RemoveFateProperties, EventName, C> {
    name = 'removeFate';
    eventName = EventName.OnMoveFate;
    targetType = [CardType.Character];
    defaultProperties: RemoveFateProperties = { amount: 1 };
    constructor(properties: ((context: C) => RemoveFateProperties) | RemoveFateProperties) {
        super(properties);
    }

    getCostMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        return ['removing {1} fate from {0}', [properties.amount]];
    }

    getEffectMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        return ['remove {1} fate from {0}', [properties.target, properties.amount]];
    }

    canAffect(card: BaseCard, context: C, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        if(properties.amount === 0 || card.location !== Location.PlayArea || card.getFate() === 0) {
            return false;
        }
        return super.canAffect(card, context) && this.checkRecipient(properties.recipient, context);
    }

    checkRecipient(origin: Player | Ring | DrawCard | undefined, context: C): boolean {
        if(origin) {
            if(['player', 'ring'].includes(origin.type)) {
                return true;
            }
            return origin.allowGameAction('placeFate', context);
        }
        return true;
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnMoveFate, C>, card: BaseCard, context: C, additionalProperties: Record<string, unknown> = {}): void {
        let { amount, recipient } = this.getProperties(context, additionalProperties);
        event.fate = amount ?? 0;
        event.recipient = recipient;
        event.origin = card;
        event.context = context;
    }

    checkEventCondition(event: ActionEvent<EventName.OnMoveFate, C>): boolean {
        return this.moveFateEventCondition(event);
    }

    isEventFullyResolved(event: ActionEvent<EventName.OnMoveFate, C>, card: BaseCard, context: C, additionalProperties: Record<string, unknown> = {}): boolean {
        let { amount, recipient } = this.getProperties(context, additionalProperties);
        return (
            !event.cancelled &&
            event.name === this.eventName &&
            event.fate === amount &&
            event.origin === card &&
            event.recipient === recipient
        );
    }

    eventHandler(event: ActionEvent<EventName.OnMoveFate, C>): void {
        this.moveFateEventHandler(event);
    }
}
