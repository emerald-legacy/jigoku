import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName } from '../Constants.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export type BreakProperties = CardActionProperties;

export class BreakAction extends CardGameAction {
    name = 'break';
    eventName = EventName.OnBreakProvince;
    targetType = [CardType.Province];
    cost = 'breaking {0}';
    effect = 'break {0}';

    canAffect(card: ProvinceCard, context: AbilityContext): boolean {
        if(!card.isProvince || card.isBroken) {
            return false;
        }
        return super.canAffect(card, context);
    }

    addPropertiesToEvent(event: GameEvent<EventName.OnBreakProvince>, card: ProvinceCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.conflict = context.game.currentConflict;
    }

    eventHandler(event: GameEvent<EventName.OnBreakProvince>): void {
        event.card.breakProvince();
    }
}
