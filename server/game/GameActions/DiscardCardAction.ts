import type { AbilityContext } from '../AbilityContext.js';
import { CardTypes, EventNames, Locations } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export type DiscardCardProperties = CardActionProperties;

export class DiscardCardAction extends CardGameAction<DiscardCardProperties> {
    name = 'discardCard';
    eventName = EventNames.OnCardsDiscarded;
    cost = 'discarding {0}';
    effect = 'discard {0}';
    targetType = [CardTypes.Attachment, CardTypes.Character, CardTypes.Event, CardTypes.Holding];

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        return (
            (card.location !== Locations.Hand || card.controller.checkRestrictions('discard', context)) &&
            super.canAffect(card, context, additionalProperties)
        );
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        let { target } = this.getProperties(context, additionalProperties);
        let cards = (target as DrawCard[]).filter((card) => this.canAffect(card, context));
        if(cards.length === 0) {
            return;
        }
        let event = this.createEvent(null, context, additionalProperties);
        this.updateEvent(event, cards, context, additionalProperties);
        events.push(event);
    }

    addPropertiesToEvent(event: any, cards: any, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let resolved: DrawCard[];
        if(!cards) {
            const target = this.getProperties(context, additionalProperties).target as DrawCard | DrawCard[];
            resolved = Array.isArray(target) ? target : [target];
        } else {
            resolved = Array.isArray(cards) ? cards : [cards];
        }
        event.originalCardStateInfo = resolved.map((a: DrawCard) => ({ location: a.location, owner: a.owner }));
        event.cards = resolved;
        event.context = context;
    }

    eventHandler(event: any, additionalProperties: Record<string, unknown> = {}): void {
        for(const card of event.cards as DrawCard[]) {
            this.checkForRefillProvince(card, event, additionalProperties);
            card.controller.moveCard(
                card,
                card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile
            );
        }
    }

    isEventFullyResolved(event: any): boolean {
        return !event.cancelled && event.name === this.eventName;
    }

    checkEventCondition(): boolean {
        return true;
    }
}
