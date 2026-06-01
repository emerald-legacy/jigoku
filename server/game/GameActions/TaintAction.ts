import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardTypes, CharacterStatus, EventNames, Locations } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export type TaintProperties = CardActionProperties;

export class TaintAction extends CardGameAction {
    name = 'taint';
    eventName = EventNames.OnCardTainted;
    targetType = [CardTypes.Character, CardTypes.Province];
    cost = 'tainting {0}';
    effect = 'taint {0}';

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(card.isTainted) {
            return false;
        }
        if(!this.targetType.includes(card.type)) {
            return false;
        }
        if(card.type === CardTypes.Character && card.location !== Locations.PlayArea) {
            return false;
        }
        if(!card.checkRestrictions('receiveTaintedToken', context)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event: Event): void {
        event.card.taint();
        event.card.game.raiseEvent(EventNames.OnStatusTokenGained, {
            token: event.card.getStatusToken(CharacterStatus.Tainted),
            card: event.card
        });
    }
}
