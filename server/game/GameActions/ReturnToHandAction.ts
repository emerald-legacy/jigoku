import type { AbilityContext } from '../AbilityContext.js';
import { CardTypes, EventNames, Locations } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

import type { Event } from '../Events/Event.js';
export type ReturnToHandProperties = CardActionProperties;

export class ReturnToHandAction extends CardGameAction {
    name = 'returnToHand';
    eventName = EventNames.OnCardLeavesPlay;
    effect = 'return {0} to their hand';
    cost = 'returning {0} to their hand';
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Event];

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        return card.location === Locations.PlayArea && super.canAffect(card, context, additionalProperties);
    }

    updateEvent(event: Event, card: DrawCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        this.updateLeavesPlayEvent(event, card, context, additionalProperties);
        event.destination = Locations.Hand;
    }

    eventHandler(event: Event, additionalProperties: Record<string, unknown> = {}): void {
        this.leavesPlayEventHandler(event, additionalProperties);
    }
}
