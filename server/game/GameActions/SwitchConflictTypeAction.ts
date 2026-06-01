import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { Conflict } from '../Conflict.js';
import { ConflictTypes, EventNames } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';

export interface SwitchConflictTypeProperties extends RingActionProperties {
    targetConflictType?: ConflictTypes;
}

export class SwitchConflictTypeAction extends RingAction<SwitchConflictTypeProperties> {
    name = 'switchConflictType';
    eventName = EventNames.OnSwitchConflictType;

    getCostMessage(context: AbilityContext): [string, unknown[]] {
        let currentConflictType = context.game.currentConflict && context.game.currentConflict.conflictType;
        let newConflictType =
            currentConflictType === ConflictTypes.Military ? ConflictTypes.Political : ConflictTypes.Military;
        return ['switching the conflict type from {0} to {1}', [currentConflictType, newConflictType]];
    }

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        let currentConflictType = context.game.currentConflict && context.game.currentConflict.conflictType;
        let newConflictType =
            currentConflictType === ConflictTypes.Military ? ConflictTypes.Political : ConflictTypes.Military;
        return ['switch the conflict type from {0} to {1}', [currentConflictType, newConflictType]];
    }

    canAffect(ring: Ring, context: AbilityContext, _additionalProperties = {}) {
        if(!context.game.currentConflict) {
            return false;
        }
        let { targetConflictType } = this.getProperties(context);
        return ring.conflictType !== targetConflictType;
    }

    eventHandler(event: GameEvent<EventNames.OnSwitchConflictType>): void {
        const context = event.context as AbilityContext;
        (context.game.currentConflict as Conflict).switchType();
    }
}
