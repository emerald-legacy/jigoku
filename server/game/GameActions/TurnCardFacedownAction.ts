import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName } from '../Constants.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export type TurnCardFacedownProperties = CardActionProperties;

export class TurnCardFacedownAction<C extends AbilityContext = AbilityContext> extends CardGameAction<TurnCardFacedownProperties, EventName.OnCardTurnedFacedown, C> {
    name = 'turnFacedown';
    eventName = EventName.OnCardTurnedFacedown;
    cost = 'turning {0} facedown';
    effect = 'turn {0} facedown';
    targetType = [CardType.Character, CardType.Holding, CardType.Province, CardType.Event];

    canAffect(card: BaseCard, context: C): boolean {
        return card.isFaceup() && super.canAffect(card, context) && card.isInProvince();
    }

    eventHandler(event: ActionEvent<EventName.OnCardTurnedFacedown, C>): void {
        const context = event.context;
        const card = event.card;
        if(card.controller !== card.owner) {
            card.owner.moveCard(card, card.location);
        }

        card.leavesPlay();
        if(card.isConflictProvince()) {
            context.game.addMessage('{0} is immediately revealed again!', card);
            card.inConflict = true;

            context.game.raiseEvent(EventName.OnCardRevealed, {
                card: card,
                context: context.game.getFrameworkContext()
            });
        } else {
            card.facedown = true;
        }
    }
}
