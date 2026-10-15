import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName, Location, RestrictionType } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export type ReadyProperties = CardActionProperties;

export class ReadyAction<C extends AbilityContext = AbilityContext> extends CardGameAction<ReadyProperties, EventName.OnCardReadied, C> {
    override name = 'ready';
    override restriction = RestrictionType.Ready;
    override eventName = EventName.OnCardReadied;
    override cost = 'readying {0}';
    override effect = 'ready {0}';
    override targetType = [CardType.Character, CardType.Attachment, CardType.Stronghold];

    override canAffect(card: BaseCard, context: C): boolean {
        if((card.location !== Location.PlayArea && card.type !== CardType.Stronghold) || !card.bowed) {
            return false;
        }
        return super.canAffect(card, context);
    }

    override eventHandler(event: ActionEvent<EventName.OnCardReadied, C>): void {
        event.card.ready();
    }
}
