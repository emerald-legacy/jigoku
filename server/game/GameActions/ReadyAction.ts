import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName, Location } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export type ReadyProperties = CardActionProperties;

export class ReadyAction<C extends AbilityContext = AbilityContext> extends CardGameAction<ReadyProperties, EventName, C> {
    name = 'ready';
    eventName = EventName.OnCardReadied;
    cost = 'readying {0}';
    effect = 'ready {0}';
    targetType = [CardType.Character, CardType.Attachment, CardType.Stronghold];

    canAffect(card: BaseCard, context: C): boolean {
        if((card.location !== Location.PlayArea && card.type !== CardType.Stronghold) || !card.bowed) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event: ActionEvent<EventName.OnCardReadied, C>): void {
        event.card.ready();
    }
}
