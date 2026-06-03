import type { Event } from '../Events/Event.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { EventName, Location } from '../Constants.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';

export interface LookAtProperties extends CardActionProperties {
    message?: string | ((context: AbilityContext) => string);
    messageArgs?: (cards: BaseCard[]) => unknown[];
}

export class LookAtAction extends CardGameAction<CardActionProperties, EventName.OnLookAtCards> {
    name = 'lookAt';
    eventName = EventName.OnLookAtCards;
    effect = 'look at a facedown card';
    defaultProperties: LookAtProperties = {
        message: '{0} sees {1}'
    };

    canAffect(card: BaseCard, context: AbilityContext) {
        if(!card.isFacedown() && (card.isInProvince() || card.location === Location.PlayArea)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties = {}): void {
        let { target } = this.getProperties(context, additionalProperties);
        let cards = (target as BaseCard[]).filter((card) => this.canAffect(card, context));
        if(cards.length === 0) {
            return;
        }
        let event = this.createEvent(null, context, additionalProperties);
        this.updateEvent(event, cards, context, additionalProperties);
        events.push(event);
    }

    addPropertiesToEvent(event: GameEvent<EventName.OnLookAtCards>, cards: unknown, context: AbilityContext, additionalProperties: Record<string, unknown>): void {
        let resolved: BaseCard[];
        if(!cards) {
            const target = this.getProperties(context, additionalProperties).target;
            resolved = (Array.isArray(target) ? target : [target]) as BaseCard[];
        } else {
            resolved = (Array.isArray(cards) ? cards : [cards]) as BaseCard[];
        }
        event.cards = resolved;
        event.stateBeforeResolution = resolved.map((a: BaseCard) => {
            return { card: a, location: a.location };
        });
        event.context = context;
    }

    eventHandler(event: GameEvent<EventName.OnLookAtCards>, additionalProperties = {}): void {
        let context = event.context as AbilityContext;
        let properties = this.getProperties(context, additionalProperties) as LookAtProperties;
        let cards = event.cards as BaseCard[];
        let messageArgs = properties.messageArgs ? properties.messageArgs(cards) : [context.source, cards];
        context.game.addMessage(this.getMessage(properties.message, context), ...messageArgs);
    }

    getMessage(message: string | ((context: AbilityContext) => string) | undefined, context: AbilityContext): string {
        if(typeof message === 'function') {
            return message(context);
        }
        return message ?? '';
    }

    isEventFullyResolved(event: GameEvent<EventName.OnLookAtCards>): boolean {
        return !event.cancelled && event.name === this.eventName;
    }

    checkEventCondition(): boolean {
        return true;
    }
}
