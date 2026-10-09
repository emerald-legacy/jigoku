import type { ActionOverrides } from './GameAction.js';
import { msg, type MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { EventName, Location } from '../Constants.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';
import { targetList, type ActionEvent } from './GameAction.js';
import type { AnyEvent } from '../TriggeredAbilityContext.js';

export interface LookAtProperties extends CardActionProperties {
    message?: (context: AbilityContext, cards: BaseCard[]) => MessageArgs;
}

export class LookAtAction<C extends AbilityContext = AbilityContext> extends CardGameAction<LookAtProperties, EventName.OnLookAtCards, C, 'message'> {
    name = 'lookAt';
    eventName = EventName.OnLookAtCards;
    effect = 'look at a facedown card';
    defaultProperties = {
        message: (context: AbilityContext, cards: BaseCard[]) => msg`${context.source} sees ${cards}`
    };

    canAffect(card: BaseCard, context: C, additionalProperties: ActionOverrides = {}) {
        if(!card.isFacedown() && (card.isInProvince() || card.location === Location.PlayArea)) {
            return false;
        }
        return super.canAffect(card, context, additionalProperties);
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const { target } = this.getProperties(context, additionalProperties);
        const cards = targetList(target).filter((card) => this.canAffect(card, context, additionalProperties));
        if(cards.length === 0) {
            return;
        }
        const event = this.createEvent(null, context, additionalProperties);
        this.updateEvent(event, cards, context, additionalProperties);
        events.push(event);
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnLookAtCards, C>, cards: BaseCard | BaseCard[] | null | undefined, context: C, additionalProperties: Record<string, unknown>): void {
        const resolved = targetList(cards || this.getProperties(context, additionalProperties).target);
        event.cards = resolved;
        event.stateBeforeResolution = resolved.map((a: BaseCard) => {
            return { card: a, location: a.location };
        });
        event.context = context;
    }

    eventHandler(event: ActionEvent<EventName.OnLookAtCards, C>, additionalProperties: ActionOverrides = {}): void {
        const context = event.context;
        const properties = this.getProperties(context, additionalProperties);
        context.game.addMessage(properties.message(context, event.cards));
    }

    isEventFullyResolved(event: AnyEvent): boolean {
        return !event.cancelled && event.name === this.eventName;
    }

    checkEventCondition(): boolean {
        return true;
    }
}
