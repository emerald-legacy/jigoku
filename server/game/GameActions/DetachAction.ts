import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export type DetachActionProperties = CardActionProperties;

export class DetachAction<C extends AbilityContext = AbilityContext> extends CardGameAction<DetachActionProperties, EventName.OnCardDetached, C> {
    name = 'detach';
    eventName = EventName.OnCardDetached;
    targetType = [CardType.Attachment];

    getEffectMessage(context: C): MessageArgs {
        let target = this.getProperties(context).target as DrawCard;
        return ['detach {1} from {0}', [target, target.parent]];
    }

    canAffect(card: DrawCard, context: C, additionalProperties = {}): boolean {
        return !!(
            card &&
            card.location === Location.PlayArea &&
            card.parent &&
            super.canAffect(card, context, additionalProperties)
        );
    }

    eventHandler(event: ActionEvent<EventName.OnCardDetached, C>): void {
        const card = event.card as DrawCard;
        card.parent?.removeAttachment(card);
        card.controller.cardsInPlay.push(card);
    }
}
