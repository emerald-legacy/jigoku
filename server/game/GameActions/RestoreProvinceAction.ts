import type { AbilityContext } from '../AbilityContext.js';
import { CardTypes, EventNames } from '../Constants.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export type RestoreProvinceProperties = CardActionProperties;

export class RestoreProvinceAction extends CardGameAction {
    name = 'restoreProvince';
    eventName = EventNames.OnRestoreProvince;
    targetType = [CardTypes.Province];
    cost = 'restoring {0}';
    effect = 'restore {0}';

    canAffect(card: ProvinceCard, context: AbilityContext): boolean {
        if(!card.isProvince) {
            return false;
        }
        if(!card.isBroken) {
            return false;
        }
        return super.canAffect(card, context);
    }

    addPropertiesToEvent(event: any, card: ProvinceCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        super.addPropertiesToEvent(event, card, context, additionalProperties);
    }

    eventHandler(event: any): void {
        event.card.restoreProvince();
    }
}
