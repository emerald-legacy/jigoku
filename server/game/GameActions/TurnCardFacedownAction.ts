import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardTypes, EventNames } from '../Constants.js';
import type { GameEvent } from '../Events/EventPayloads.js';
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

    eventHandler(event: GameEvent<EventNames.OnCardTurnedFacedown>): void {
        const context = event.context as AbilityContext;
        const card = event.card as BaseCard;
        if(card.controller !== card.owner) {
            card.owner.moveCard(card, card.location);
        }

        card.leavesPlay();
        if(card.isConflictProvince()) {
            context.game.addMessage('{0} is immediately revealed again!', card);
            card.inConflict = true;

            context.game.raiseEvent(EventNames.OnCardRevealed, {
                card: card,
                context: context.game.getFrameworkContext()
            });
        } else {
            card.facedown = true;
        }
    }
}
