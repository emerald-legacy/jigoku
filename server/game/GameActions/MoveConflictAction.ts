import type { AbilityContext } from '../AbilityContext.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import { CardTypes, EventNames } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

import type { GameEvent } from '../Events/EventPayloads.js';
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

    canAffect(card: ProvinceCard, context: AbilityContext): boolean {
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

    eventHandler(event: GameEvent<EventNames.OnConflictMoved>, _additionalProperties: Record<string, unknown> = {}): void {
        let context = (event.context as AbilityContext);
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
