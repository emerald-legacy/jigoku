import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName, RestrictionType } from '../Constants.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';
import type Player from '../Player.js';

export interface BreakProperties extends CardActionProperties {
    /** Defaults to the province controller's opponent (RRG: a province broken outside conflict resolution) */
    breaker?: Player;
}

export class BreakProvinceAction<Context extends AbilityContext = AbilityContext> extends CardGameAction<BreakProperties, EventName.OnBreakProvince, Context> {
    override name = 'breakProvince';
    override restriction = RestrictionType.Break;
    override eventName = EventName.OnBreakProvince;
    override targetType = [CardType.Province];
    override cost = 'breaking {0}';
    override effect = 'break {0}';

    override canAffect(card: ProvinceCard, context: Context): boolean {
        if(!card.isProvince || card.isBroken) {
            return false;
        }
        return super.canAffect(card, context);
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnBreakProvince, Context>, card: ProvinceCard, context: Context, additionalProperties: ActionOverrides = {}): void {
        const { breaker } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.conflict = context.game.currentConflict;
        event.breaker = breaker ?? card.controller.opponent;
    }

    override eventHandler(event: ActionEvent<EventName.OnBreakProvince, Context>): void {
        event.card.breakProvince(event.breaker);
        event.conflict?.brokenProvinces.push(event.card);
    }
}
