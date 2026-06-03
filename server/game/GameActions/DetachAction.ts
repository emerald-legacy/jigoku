import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export type DetachActionProperties = CardActionProperties;

export class DetachAction extends CardGameAction<DetachActionProperties, EventName.OnCardDetached> {
    name = 'detach';
    eventName = EventName.OnCardDetached;
    targetType = [CardType.Attachment];

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        let target = this.getProperties(context).target as DrawCard;
        return ['detach {1} from {0}', [target, target.parent]];
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        return !!(
            card &&
            card.location === Location.PlayArea &&
            card.parent &&
            super.canAffect(card, context, additionalProperties)
        );
    }

    eventHandler(event: GameEvent<EventName.OnCardDetached>): void {
        const card = event.card as DrawCard;
        (card.parent as DrawCard).removeAttachment(card);
        card.controller.cardsInPlay.push(card);
    }
}
