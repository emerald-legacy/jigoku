import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, CharacterStatus, EventName, Location, RestrictionType } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export type TaintProperties = CardActionProperties;

export class TaintAction<C extends AbilityContext = AbilityContext> extends CardGameAction<TaintProperties, EventName.OnCardTainted, C> {
    override name = 'taint';
    override eventName = EventName.OnCardTainted;
    override targetType = [CardType.Character, CardType.Province];
    override cost = 'tainting {0}';
    override effect = 'taint {0}';

    override canAffect(card: BaseCard, context: C): boolean {
        if(card.isTainted) {
            return false;
        }
        if(card.type === CardType.Character && card.location !== Location.PlayArea) {
            return false;
        }
        if(!card.checkRestrictions(RestrictionType.ReceiveTaintedToken, context)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    override eventHandler(event: ActionEvent<EventName.OnCardTainted, C>): void {
        const card = event.card;
        card.taint();
        card.game.raiseEvent(EventName.OnStatusTokenGained, {
            token: card.getStatusToken(CharacterStatus.Tainted),
            card: card
        });
    }
}
