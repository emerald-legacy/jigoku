import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName, RestrictionType } from '../Constants.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export type RestoreProvinceProperties = CardActionProperties;

export class RestoreProvinceAction<C extends AbilityContext = AbilityContext> extends CardGameAction<CardActionProperties, EventName.OnRestoreProvince, C> {
    override name = 'restoreProvince';
    override restriction = RestrictionType.RestoreProvince;
    override eventName = EventName.OnRestoreProvince;
    override targetType = [CardType.Province];
    override cost = 'restoring {0}';
    override effect = 'restore {0}';

    override canAffect(card: ProvinceCard, context: C): boolean {
        if(!card.isProvince) {
            return false;
        }
        if(!card.isBroken) {
            return false;
        }
        return super.canAffect(card, context);
    }

    override eventHandler(event: ActionEvent<EventName.OnRestoreProvince, C>): void {
        event.card.restoreProvince();
    }
}
