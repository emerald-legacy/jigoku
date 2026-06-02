import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName, Location } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export type BowActionProperties = CardActionProperties;

export class BowAction extends CardGameAction<BowActionProperties> {
    name = 'bow';
    eventName = EventName.OnCardBowed;
    cost = 'bowing {0}';
    effect = 'bow {0}';
    targetType = [CardType.Character, CardType.Attachment, CardType.Stronghold];

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if((card.location !== Location.PlayArea && card.type !== CardType.Stronghold) || card.bowed) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event: GameEvent<EventName.OnCardBowed>): void {
        event.card.bow();
    }
}
