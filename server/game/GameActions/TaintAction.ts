import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, CharacterStatus, EventName, Location } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export type TaintProperties = CardActionProperties;

export class TaintAction<C extends AbilityContext = AbilityContext> extends CardGameAction<TaintProperties, EventName.OnCardTainted, C> {
    name = 'taint';
    eventName = EventName.OnCardTainted;
    targetType = [CardType.Character, CardType.Province];
    cost = 'tainting {0}';
    effect = 'taint {0}';

    canAffect(card: BaseCard, context: C): boolean {
        if(card.isTainted) {
            return false;
        }
        if(!this.targetType.includes(card.type)) {
            return false;
        }
        if(card.type === CardType.Character && card.location !== Location.PlayArea) {
            return false;
        }
        if(!card.checkRestrictions('receiveTaintedToken', context)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event: ActionEvent<EventName.OnCardTainted, C>): void {
        const card = event.card;
        card.taint();
        card.game.raiseEvent(EventName.OnStatusTokenGained, {
            token: card.getStatusToken(CharacterStatus.Tainted),
            card: card
        });
    }
}
