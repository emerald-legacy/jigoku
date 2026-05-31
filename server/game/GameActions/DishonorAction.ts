import type { AbilityContext } from '../AbilityContext.js';
import { CardTypes, CharacterStatus, EventNames, Locations } from '../Constants.js';
import type BaseCard from '../BaseCard.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';

export type DishonorProperties = CardActionProperties;

export class DishonorAction extends CardGameAction {
    name = 'dishonor';
    eventName = EventNames.OnCardDishonored;
    targetType = [CardTypes.Character];
    cost = 'dishonoring {0}';
    effect = 'dishonor {0}';

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(card.location !== Locations.PlayArea || card.type !== CardTypes.Character || card.isDishonored) {
            return false;
        } else if(!card.isHonored && !card.checkRestrictions('receiveDishonorToken', context)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event: any): void {
        event.card.dishonor();
        if(event.card.isDishonored) {
            event.card.game.raiseEvent(EventNames.OnStatusTokenGained, {
                token: event.card.getStatusToken(CharacterStatus.Dishonored),
                card: event.card
            });
        }
    }

    getCostMessage(context: AbilityContext) {
        const dishonoredCharacters = context.costs[this.name];
        if(Array.isArray(dishonoredCharacters) && dishonoredCharacters.length === 0) {
            return undefined;
        }

        return super.getCostMessage(context);
    }
}
