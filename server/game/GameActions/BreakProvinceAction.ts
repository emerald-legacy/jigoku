import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName, RestrictionType } from '../Constants.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export type BreakProperties = CardActionProperties;

export class BreakProvinceAction<C extends AbilityContext = AbilityContext> extends CardGameAction<BreakProperties, EventName.OnBreakProvince, C> {
    name = 'breakProvince';
    restriction = RestrictionType.Break;
    eventName = EventName.OnBreakProvince;
    targetType = [CardType.Province];
    cost = 'breaking {0}';
    effect = 'break {0}';

    canAffect(card: ProvinceCard, context: C): boolean {
        if(!card.isProvince || card.isBroken) {
            return false;
        }
        return super.canAffect(card, context);
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnBreakProvince, C>, card: ProvinceCard, context: C, additionalProperties: ActionOverrides = {}): void {
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.conflict = context.game.currentConflict;
    }

    eventHandler(event: ActionEvent<EventName.OnBreakProvince, C>): void {
        event.card.breakProvince();
    }
}
