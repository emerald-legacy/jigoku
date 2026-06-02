import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { Event } from '../Events/Event.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { GameObject } from '../GameObject.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export type DiscardCardProperties = CardActionProperties;

export class DiscardCardAction extends CardGameAction<DiscardCardProperties> {
    name = 'discardCard';
    eventName = EventName.OnCardsDiscarded;
    cost = 'discarding {0}';
    effect = 'discard {0}';
    targetType = [CardType.Attachment, CardType.Character, CardType.Event, CardType.Holding];

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        return (
            (card.location !== Location.Hand || card.controller.checkRestrictions('discard', context)) &&
            super.canAffect(card, context, additionalProperties)
        );
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties = {}): void {
        let { target } = this.getProperties(context, additionalProperties);
        let cards = (target as DrawCard[]).filter((card) => this.canAffect(card, context));
        if(cards.length === 0) {
            return;
        }
        let event = this.createEvent(null, context, additionalProperties);
        this.updateEvent(event, cards, context, additionalProperties);
        events.push(event);
    }

    addPropertiesToEvent(event: GameEvent<EventName.OnCardsDiscarded>, cards: GameObject | GameObject[] | null | undefined, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let resolved: DrawCard[];
        if(!cards) {
            const target = this.getProperties(context, additionalProperties).target as DrawCard | DrawCard[];
            resolved = Array.isArray(target) ? target : [target];
        } else {
            resolved = (Array.isArray(cards) ? cards : [cards]) as DrawCard[];
        }
        event.originalCardStateInfo = resolved.map((a: DrawCard) => ({ location: a.location, owner: a.owner }));
        event.cards = resolved;
        event.context = context;
    }

    eventHandler(event: GameEvent<EventName.OnCardsDiscarded>, additionalProperties: Record<string, unknown> = {}): void {
        for(const card of event.cards as DrawCard[]) {
            this.checkForRefillProvince(card, event, additionalProperties);
            card.controller.moveCard(
                card,
                card.isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile
            );
        }
    }

    isEventFullyResolved(event: GameEvent<EventName.OnCardsDiscarded>): boolean {
        return !event.cancelled && event.name === this.eventName;
    }

    checkEventCondition(): boolean {
        return true;
    }
}
