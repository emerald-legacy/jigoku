import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName, Location, RestrictionType } from '../Constants.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import type { Event } from '../Events/Event.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import { targetList, type ActionEvent } from './GameAction.js';
import type { AnyEvent } from '../TriggeredAbilityContext.js';

export type DiscardCardProperties = CardActionProperties;

export class DiscardCardAction<C extends AbilityContext = AbilityContext> extends CardGameAction<DiscardCardProperties, EventName.OnCardsDiscarded, C> {
    name = 'discardCard';
    eventName = EventName.OnCardsDiscarded;
    cost = 'discarding {0}';
    effect = 'discard {0}';
    targetType = [CardType.Attachment, CardType.Character, CardType.Event, CardType.Holding];

    canAffect(card: DrawCard, context: C, additionalProperties: ActionOverrides = {}): boolean {
        return (
            (card.location !== Location.Hand || card.controller.checkRestrictions(RestrictionType.Discard, context)) &&
            super.canAffect(card, context, additionalProperties)
        );
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const { target } = this.getProperties(context, additionalProperties);
        const cards = targetList(target).filter((card) => card.isDrawCard() && this.canAffect(card, context, additionalProperties));
        if(cards.length === 0) {
            return;
        }
        const event = this.createEvent(null, context, additionalProperties);
        this.updateEvent(event, cards, context, additionalProperties);
        events.push(event);
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnCardsDiscarded, C>, cards: BaseCard | BaseCard[] | null | undefined, context: C, additionalProperties: ActionOverrides = {}): void {
        const resolved = targetList(cards || this.getProperties(context, additionalProperties).target).filter((card) => card.isDrawCard());
        event.originalCardStateInfo = resolved.map((a: DrawCard) => ({ location: a.location, owner: a.owner }));
        event.cards = resolved;
        event.context = context;
    }

    eventHandler(event: ActionEvent<EventName.OnCardsDiscarded, C>, additionalProperties: ActionOverrides = {}): void {
        for(const card of event.cards) {
            this.checkForRefillProvince(card, event, additionalProperties);
            card.controller.moveCard(
                card,
                card.isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile
            );
        }
    }

    isEventFullyResolved(event: AnyEvent): boolean {
        return !event.cancelled && event.name === this.eventName;
    }

    checkEventCondition(): boolean {
        return true;
    }
}
