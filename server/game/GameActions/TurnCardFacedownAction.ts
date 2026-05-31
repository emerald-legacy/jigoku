import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardTypes, EventNames } from '../Constants.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';

export type TurnCardFacedownProperties = CardActionProperties;

export class TurnCardFacedownAction extends CardGameAction {
    name = 'turnFacedown';
    eventName = EventNames.OnCardTurnedFacedown;
    cost = 'turning {0} facedown';
    effect = 'turn {0} facedown';
    targetType = [CardTypes.Character, CardTypes.Holding, CardTypes.Province, CardTypes.Event];

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        return card.isFaceup() && super.canAffect(card, context) && card.isInProvince();
    }

    eventHandler(event: Event): void {
        const context = event.context as AbilityContext;
        if(event.card.controller !== event.card.owner) {
            event.card.owner.moveCard(event.card, event.card.location);
        }

        event.card.leavesPlay();
        if(event.card.isConflictProvince()) {
            context.game.addMessage('{0} is immediately revealed again!', event.card);
            event.card.inConflict = true;

            context.game.raiseEvent(EventNames.OnCardRevealed, {
                card: event.card,
                context: context.game.getFrameworkContext()
            });
        } else {
            event.card.facedown = true;
        }
    }
}
