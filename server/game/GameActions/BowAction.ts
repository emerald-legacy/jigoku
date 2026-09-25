import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName, Location } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export type BowActionProperties = CardActionProperties;

export class BowAction<C extends AbilityContext = AbilityContext> extends CardGameAction<BowActionProperties, EventName, C> {
    name = 'bow';
    eventName = EventName.OnCardBowed;
    cost = 'bowing {0}';
    effect = 'bow {0}';
    targetType = [CardType.Character, CardType.Attachment, CardType.Stronghold];

    canAffect(card: BaseCard, context: C): boolean {
        if((card.location !== Location.PlayArea && card.type !== CardType.Stronghold) || card.bowed) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event: ActionEvent<EventName.OnCardBowed, C>): void {
        event.card.bow();
    }
}
