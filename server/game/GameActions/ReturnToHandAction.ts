import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, type EventName, Location, RestrictionType } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { CardActionProperties } from './CardGameAction.js';
import { LeavesPlayAction } from './LeavesPlayAction.js';
import type { ActionEvent } from './GameAction.js';

export type ReturnToHandProperties = CardActionProperties;

export class ReturnToHandAction<Context extends AbilityContext = AbilityContext> extends LeavesPlayAction<ReturnToHandProperties, Context> {
    override name = 'returnToHand';
    override restriction = RestrictionType.ReturnToHand;
    override effect = 'return {0} to their hand';
    override cost = 'returning {0} to their hand';
    override targetType = [CardType.Character, CardType.Attachment, CardType.Event];

    override canAffect(card: DrawCard, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        return card.location === Location.PlayArea && super.canAffect(card, context, additionalProperties);
    }

    override updateEvent(event: ActionEvent<EventName.OnCardLeavesPlay, Context>, card: DrawCard, context: Context, additionalProperties: ActionOverrides = {}): void {
        super.updateEvent(event, card, context, additionalProperties);
        event.destination = Location.Hand;
    }
}
