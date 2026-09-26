import type { AbilityContext } from '../AbilityContext.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import { CardType, EventName } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

import type { ActionEvent } from './GameAction.js';
export type MoveConflictProperties = CardActionProperties;

export class MoveConflictAction<C extends AbilityContext = AbilityContext> extends CardGameAction<MoveConflictProperties, EventName.OnConflictMoved, C> {
    name = 'moveConflict';
    eventName = EventName.OnConflictMoved;
    targetType = [CardType.Province];
    effect = 'move the conflict to {0}';
    cost = 'moves the conflict to {0}';
    defaultProperties: MoveConflictProperties = {};
    constructor(properties: ((context: C) => MoveConflictProperties) | MoveConflictProperties) {
        super(properties);
    }

    canAffect(card: ProvinceCard, context: C): boolean {
        if(
            !card ||
            !context.game.isDuringConflict() ||
            card.type !== CardType.Province ||
            card.isConflictProvince() ||
            !card.canBeAttacked() ||
            !context.game.currentConflict || !context.game.currentConflict.getConflictProvinces().some((a) => a.controller === card.controller)
        ) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event: ActionEvent<EventName.OnConflictMoved, C>, _additionalProperties: Record<string, unknown> = {}): void {
        let context = event.context;
        let newProvince = event.card;
        const conflict = context.game.currentConflict;
        if(!conflict || !conflict.conflictProvince) {
            return;
        }

        newProvince.inConflict = true;
        conflict.conflictProvince.inConflict = false;
        conflict.conflictProvince = newProvince;
        if(newProvince.isFacedown()) {
            const revealEvent = context.game.actions
                .reveal()
                .getEvent(newProvince, context.game.getFrameworkContext());
            context.game.openThenEventWindow(revealEvent);
        }
    }
}
