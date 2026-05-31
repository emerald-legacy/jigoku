import type { AbilityContext } from '../AbilityContext.js';
import { CardTypes, EventNames, Locations } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export type DetachActionProperties = CardActionProperties;

export class DetachAction extends CardGameAction<DetachActionProperties> {
    name = 'detach';
    eventName = EventNames.OnCardDetached;
    targetType = [CardTypes.Attachment];

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let target = this.getProperties(context).target as any;
        return ['detach {1} from {0}', [target, target.parent]];
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        return !!(
            card &&
            card.location === Locations.PlayArea &&
            card.parent &&
            super.canAffect(card, context, additionalProperties)
        );
    }

    eventHandler(event: any): void {
        event.card.parent.removeAttachment(event.card);
        event.card.controller.cardsInPlay.push(event.card);
    }
}
