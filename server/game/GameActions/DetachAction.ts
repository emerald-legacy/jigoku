import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import { targetList, type ActionEvent } from './GameAction.js';

export type DetachProperties = CardActionProperties;

export class DetachAction<C extends AbilityContext = AbilityContext> extends CardGameAction<DetachProperties, EventName.OnCardDetached, C> {
    override name = 'detach';
    override eventName = EventName.OnCardDetached;
    override targetType = [CardType.Attachment];

    protected override effectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        const [target] = targetList(this.getProperties(context, additionalProperties).target);
        return ['detach {0} from {1}', [target.parent]];
    }

    override canAffect(card: DrawCard, context: C, additionalProperties: ActionOverrides = {}): boolean {
        return !!(
            card.location === Location.PlayArea &&
            card.parent &&
            super.canAffect(card, context, additionalProperties)
        );
    }

    override eventHandler(event: ActionEvent<EventName.OnCardDetached, C>): void {
        const card = event.card;
        card.parent?.removeAttachment(card);
        card.controller.cardsInPlay.push(card);
    }
}
