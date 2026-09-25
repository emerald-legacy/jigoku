import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

import type { ActionEvent } from './GameAction.js';
export type ReturnToHandProperties = CardActionProperties;

export class ReturnToHandAction<C extends AbilityContext = AbilityContext> extends CardGameAction<ReturnToHandProperties, EventName, C> {
    name = 'returnToHand';
    eventName = EventName.OnCardLeavesPlay;
    effect = 'return {0} to their hand';
    cost = 'returning {0} to their hand';
    targetType = [CardType.Character, CardType.Attachment, CardType.Event];

    canAffect(card: DrawCard, context: C, additionalProperties = {}): boolean {
        return card.location === Location.PlayArea && super.canAffect(card, context, additionalProperties);
    }

    updateEvent(event: ActionEvent<EventName.OnCardLeavesPlay, C>, card: DrawCard, context: C, additionalProperties: Record<string, unknown> = {}): void {
        this.updateLeavesPlayEvent(event, card, context, additionalProperties);
        event.destination = Location.Hand;
    }

    eventHandler(event: ActionEvent<EventName.OnCardLeavesPlay, C>, additionalProperties: Record<string, unknown> = {}): void {
        this.leavesPlayEventHandler(event, additionalProperties);
    }
}
