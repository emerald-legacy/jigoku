import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName, RestrictionType } from '../Constants.js';
import type BaseCard from '../BaseCard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import { targetList, type ActionEvent, type ActionOverrides } from './GameAction.js';

export type DishonorProvinceProperties = CardActionProperties;

export class DishonorProvinceAction<Context extends AbilityContext = AbilityContext> extends CardGameAction<DishonorProvinceProperties, EventName.OnCardDishonored, Context> {
    override name = 'dishonorProvince';
    override restriction = RestrictionType.Dishonor;
    override eventName = EventName.OnCardDishonored;
    override targetType = [CardType.Province];
    override cost = 'dishonoring {0}';
    override effect = 'dishonor {0}';

    protected override effectMessage(): MessageArgs {
        return ['place a dishonored status token on {0}, blanking it', []];
    }

    /** A facedown province is named by its location. */
    protected override effectMessageTarget(context: Context, additionalProperties: ActionOverrides = {}): MsgArg {
        return targetList(this.getProperties(context, additionalProperties).target).map((target) => target.isFacedown() ? target.location : target);
    }

    override canAffect(card: BaseCard, context: Context): boolean {
        if(card.type !== CardType.Province || card.isDishonored) {
            return false;
        } else if(!card.isHonored && !card.checkRestrictions(RestrictionType.ReceiveDishonorToken, context)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    override eventHandler(event: ActionEvent<EventName.OnCardDishonored, Context>): void {
        event.card.dishonor();
    }
}
