import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../basecard.js';
import { CardTypes, EventNames } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export type MoveConflictProperties = CardActionProperties;

export class MoveConflictAction extends CardGameAction {
    name = 'moveConflict';
    eventName = EventNames.OnConflictMoved;
    targetType = [CardTypes.Province];
    effect = 'move the conflict to {0}';
    cost = 'moves the conflict to {0}';
    defaultProperties: MoveConflictProperties = {};
    constructor(properties: ((context: AbilityContext) => MoveConflictProperties) | MoveConflictProperties) {
        super(properties);
    }

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(
            !card ||
            !context.game.isDuringConflict() ||
            card.type !== CardTypes.Province ||
            card.isConflictProvince() ||
            !card.canBeAttacked() ||
            !context.game.currentConflict || !context.game.currentConflict.getConflictProvinces().some((a) => a.controller === card.controller)
        ) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event: any, _additionalProperties: Record<string, unknown> = {}): void {
        let context = event.context;
        let newProvince = event.card;

        newProvince.inConflict = true;
        context.game.currentConflict.conflictProvince.inConflict = false;
        context.game.currentConflict.conflictProvince = newProvince;
        if(newProvince.isFacedown()) {
            const revealEvent = event.context.game.actions
                .reveal()
                .getEvent(newProvince, event.context.game.getFrameworkContext());
            event.context.game.openThenEventWindow(revealEvent);
        }
    }
}
