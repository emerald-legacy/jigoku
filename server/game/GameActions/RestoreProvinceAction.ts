import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName } from '../Constants.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export type RestoreProvinceProperties = CardActionProperties;

export class RestoreProvinceAction<C extends AbilityContext = AbilityContext> extends CardGameAction<CardActionProperties, EventName.OnRestoreProvince, C> {
    name = 'restoreProvince';
    eventName = EventName.OnRestoreProvince;
    targetType = [CardType.Province];
    cost = 'restoring {0}';
    effect = 'restore {0}';

    canAffect(card: ProvinceCard, context: C): boolean {
        if(!card.isProvince) {
            return false;
        }
        if(!card.isBroken) {
            return false;
        }
        return super.canAffect(card, context);
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnRestoreProvince, C>, card: ProvinceCard, context: C, additionalProperties: Record<string, unknown> = {}): void {
        super.addPropertiesToEvent(event, card, context, additionalProperties);
    }

    eventHandler(event: ActionEvent<EventName.OnRestoreProvince, C>): void {
        (event.card as ProvinceCard).restoreProvince();
    }
}
