import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { EventNames, Locations } from '../Constants.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';

export interface LookAtProperties extends CardActionProperties {
    message?: string | ((context: AbilityContext) => string);
    messageArgs?: (cards: any) => any[];
}

export class LookAtAction extends CardGameAction {
    name = 'lookAt';
    eventName = EventNames.OnLookAtCards;
    effect = 'look at a facedown card';
    defaultProperties: LookAtProperties = {
        message: '{0} sees {1}'
    };

    canAffect(card: BaseCard, context: AbilityContext) {
        if(!card.isFacedown() && (card.isInProvince() || card.location === Locations.PlayArea)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        let { target } = this.getProperties(context, additionalProperties);
        let cards = (target as BaseCard[]).filter((card) => this.canAffect(card, context));
        if(cards.length === 0) {
            return;
        }
        let event = this.createEvent(null, context, additionalProperties);
        this.updateEvent(event, cards, context, additionalProperties);
        events.push(event);
    }

    addPropertiesToEvent(event: any, cards: any, context: AbilityContext, additionalProperties: any): void {
        if(!cards) {
            cards = this.getProperties(context, additionalProperties).target;
        }
        if(!Array.isArray(cards)) {
            cards = [cards];
        }
        event.cards = cards;
        event.stateBeforeResolution = cards.map((a: BaseCard) => {
            return { card: a, location: a.location };
        });
        event.context = context;
    }

    eventHandler(event: any, additionalProperties = {}): void {
        let context = event.context;
        let properties = this.getProperties(context, additionalProperties) as LookAtProperties;
        let messageArgs = properties.messageArgs ? properties.messageArgs(event.cards) : [context.source, event.cards];
        context.game.addMessage(this.getMessage(properties.message, context), ...messageArgs);
    }

    getMessage(message: string | ((context: AbilityContext) => string) | undefined, context: AbilityContext): string {
        if(typeof message === 'function') {
            return message(context);
        }
        return message ?? '';
    }

    isEventFullyResolved(event: any): boolean {
        return !event.cancelled && event.name === this.eventName;
    }

    checkEventCondition(): boolean {
        return true;
    }
}
