import { msg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName, RestrictionType } from '../Constants.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export type TurnCardFacedownProperties = CardActionProperties;

export class TurnFacedownAction<Context extends AbilityContext = AbilityContext> extends CardGameAction<TurnCardFacedownProperties, EventName.OnCardTurnedFacedown, Context> {
    override name = 'turnFacedown';
    override restriction = RestrictionType.TurnFacedown;
    override eventName = EventName.OnCardTurnedFacedown;
    override cost = 'turning {0} facedown';
    override effect = 'turn {0} facedown';
    override targetType = [CardType.Character, CardType.Holding, CardType.Province, CardType.Event];

    override canAffect(card: BaseCard, context: Context): boolean {
        return card.isFaceup() && super.canAffect(card, context) && card.isInProvince();
    }

    override eventHandler(event: ActionEvent<EventName.OnCardTurnedFacedown, Context>): void {
        const context = event.context;
        const card = event.card;
        if(card.controller !== card.owner) {
            card.owner.moveCard(card, card.location);
        }

        // turning facedown is leaving play: lasting effects on the card expire (EmeraldDB ruling)
        card.leavesPlay();
        card.removeLastingEffects();
        if(card.isConflictProvince()) {
            context.game.addMessage(msg`${card} is immediately revealed again!`);
            card.inConflict = true;

            context.game.raiseEvent(EventName.OnCardRevealed, {
                card: card,
                context: context.game.getGameContext()
            });
        } else {
            card.facedown = true;
        }
    }
}
