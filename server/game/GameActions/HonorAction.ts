import type { AbilityContext } from '../AbilityContext.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type BaseCard from '../BaseCard.js';
import { CardType, CharacterStatus, EventName, Location } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export type HonorProperties = CardActionProperties;

export class HonorAction extends CardGameAction {
    name = 'honor';
    eventName = EventName.OnCardHonored;
    targetType = [CardType.Character];
    cost = 'honoring {0}';
    effect = 'honor {0}';

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(card.location !== Location.PlayArea || card.type !== CardType.Character || card.isHonored) {
            return false;
        } else if(!card.isDishonored && !card.checkRestrictions('receiveHonorToken', context)) {
            return false;
        }
        if(!context.player.checkRestrictions('honor', context)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event: GameEvent<EventName.OnCardHonored>): void {
        event.card.honor();
        if(event.card.isHonored) {
            event.card.game.raiseEvent(EventName.OnStatusTokenGained, {
                token: event.card.getStatusToken(CharacterStatus.Honored),
                card: event.card
            });
        }
    }
}
