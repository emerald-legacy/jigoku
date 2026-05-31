import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardTypes, EventNames } from '../Constants.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import type BaseCard from '../BaseCard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export type DishonorProvinceProperties = CardActionProperties;

export class DishonorProvinceAction extends CardGameAction {
    name = 'dishonor';
    eventName = EventNames.OnCardDishonored;
    targetType = [CardTypes.Province];
    cost = 'dishonoring {0}';
    effect = 'dishonor {0}';

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        const properties = this.getProperties(context) as DishonorProvinceProperties;
        const targetArray = [];
        if(properties.target) {
            if(Array.isArray(properties.target)) {
                properties.target.forEach((t) => {
                    const target = t as ProvinceCard;
                    const targetMessage = target && target.isFacedown && target.isFacedown() ? target.location : target;
                    targetArray.push(targetMessage);
                });
            } else {
                const target = properties.target as ProvinceCard;
                const targetMessage = target && target.isFacedown && target.isFacedown() ? target.location : target;
                targetArray.push(targetMessage);
            }
        }
        return ['place a dishonored status token on {0}, blanking it', [targetArray]];
    }

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(card.type !== CardTypes.Province || card.isDishonored) {
            return false;
        } else if(!card.isHonored && !card.checkRestrictions('receiveDishonorToken', context)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event: Event): void {
        event.card.dishonor();
    }
}
