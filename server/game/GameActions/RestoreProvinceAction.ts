import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName } from '../Constants.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export type RestoreProvinceProperties = CardActionProperties;

export class RestoreProvinceAction extends CardGameAction<CardActionProperties, EventName.OnRestoreProvince> {
    name = 'restoreProvince';
    eventName = EventName.OnRestoreProvince;
    targetType = [CardType.Province];
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

    addPropertiesToEvent(event: GameEvent<EventName.OnRestoreProvince>, card: ProvinceCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        super.addPropertiesToEvent(event, card, context, additionalProperties);
    }

    eventHandler(event: GameEvent<EventName.OnRestoreProvince>): void {
        (event.card as ProvinceCard).restoreProvince();
    }
}
