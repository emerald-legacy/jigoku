import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName } from '../Constants.js';
import type BaseCard from '../BaseCard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export type DishonorProvinceProperties = CardActionProperties;

export class DishonorProvinceAction<C extends AbilityContext = AbilityContext> extends CardGameAction<DishonorProvinceProperties, EventName.OnCardDishonored, C> {
    name = 'dishonor';
    eventName = EventName.OnCardDishonored;
    targetType = [CardType.Province];
    cost = 'dishonoring {0}';
    effect = 'dishonor {0}';

    getEffectMessage(context: C): MessageArgs {
        const properties = this.getProperties(context);
        const targetArray = [];
        if(properties.target) {
            if(Array.isArray(properties.target)) {
                properties.target.forEach((t) => {
                    const target = t;
                    const targetMessage = target && target.isFacedown && target.isFacedown() ? target.location : target;
                    targetArray.push(targetMessage);
                });
            } else {
                const target = properties.target;
                const targetMessage = target && target.isFacedown && target.isFacedown() ? target.location : target;
                targetArray.push(targetMessage);
            }
        }
        return ['place a dishonored status token on {0}, blanking it', [targetArray]];
    }

    canAffect(card: BaseCard, context: C): boolean {
        if(card.type !== CardType.Province || card.isDishonored) {
            return false;
        } else if(!card.isHonored && !card.checkRestrictions('receiveDishonorToken', context)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event: ActionEvent<EventName.OnCardDishonored, C>): void {
        event.card.dishonor();
    }
}
