import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

import type { GameEvent } from '../Events/EventPayloads.js';
export type ReturnToHandProperties = CardActionProperties;

export class ReturnToHandAction extends CardGameAction {
    name = 'returnToHand';
    eventName = EventName.OnCardLeavesPlay;
    effect = 'return {0} to their hand';
    cost = 'returning {0} to their hand';
    targetType = [CardType.Character, CardType.Attachment, CardType.Event];

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        return card.location === Location.PlayArea && super.canAffect(card, context, additionalProperties);
    }

    updateEvent(event: GameEvent<EventName.OnCardLeavesPlay>, card: DrawCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        this.updateLeavesPlayEvent(event, card, context, additionalProperties);
        event.destination = Location.Hand;
    }

    eventHandler(event: GameEvent<EventName.OnCardLeavesPlay>, additionalProperties: Record<string, unknown> = {}): void {
        this.leavesPlayEventHandler(event, additionalProperties);
    }
}
