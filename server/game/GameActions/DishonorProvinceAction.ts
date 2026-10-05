import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName } from '../Constants.js';
import type BaseCard from '../BaseCard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import { targetList, type ActionEvent } from './GameAction.js';

export type DishonorProvinceProperties = CardActionProperties;

export class DishonorProvinceAction<C extends AbilityContext = AbilityContext> extends CardGameAction<DishonorProvinceProperties, EventName.OnCardDishonored, C> {
    name = 'dishonor';
    eventName = EventName.OnCardDishonored;
    targetType = [CardType.Province];
    cost = 'dishonoring {0}';
    effect = 'dishonor {0}';

    protected effectMessage(): MessageArgs {
        return ['place a dishonored status token on {0}, blanking it', []];
    }

    /** A facedown province is named by its location. */
    protected effectMessageTarget(context: C): MsgArg {
        return targetList(this.getProperties(context).target).map((target) => target.isFacedown() ? target.location : target);
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
