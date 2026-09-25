import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { Conflict } from '../Conflict.js';
import { ConflictType, EventName } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';
import type { ActionEvent } from './GameAction.js';

export interface SwitchConflictTypeProperties extends RingActionProperties {
    targetConflictType?: ConflictType;
}

export class SwitchConflictTypeAction<C extends AbilityContext = AbilityContext> extends RingAction<SwitchConflictTypeProperties, EventName, C> {
    name = 'switchConflictType';
    eventName = EventName.OnSwitchConflictType;

    getCostMessage(context: C): MessageArgs {
        let currentConflictType = context.game.currentConflict && context.game.currentConflict.conflictType;
        let newConflictType =
            currentConflictType === ConflictType.Military ? ConflictType.Political : ConflictType.Military;
        return ['switching the conflict type from {0} to {1}', [currentConflictType, newConflictType]];
    }

    getEffectMessage(context: C): MessageArgs {
        let currentConflictType = context.game.currentConflict && context.game.currentConflict.conflictType;
        let newConflictType =
            currentConflictType === ConflictType.Military ? ConflictType.Political : ConflictType.Military;
        return ['switch the conflict type from {0} to {1}', [currentConflictType, newConflictType]];
    }

    canAffect(ring: Ring, context: C, _additionalProperties = {}) {
        if(!context.game.currentConflict) {
            return false;
        }
        let { targetConflictType } = this.getProperties(context);
        return ring.conflictType !== targetConflictType;
    }

    eventHandler(event: ActionEvent<EventName.OnSwitchConflictType, C>): void {
        const context = event.context;
        (context.game.currentConflict as Conflict).switchType();
    }
}
