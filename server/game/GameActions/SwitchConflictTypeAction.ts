import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { ConflictType, EventName } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';
import type { ActionEvent } from './GameAction.js';

export interface SwitchConflictTypeProperties extends RingActionProperties {
    targetConflictType?: ConflictType;
}

export class SwitchConflictTypeAction<C extends AbilityContext = AbilityContext> extends RingAction<SwitchConflictTypeProperties, EventName.OnSwitchConflictType, C> {
    name = 'switchConflictType';
    eventName = EventName.OnSwitchConflictType;

    getCostMessage(context: C): MessageArgs {
        const currentConflictType = context.game.currentConflict && context.game.currentConflict.conflictType;
        const newConflictType =
            currentConflictType === ConflictType.Military ? ConflictType.Political : ConflictType.Military;
        return ['switching the conflict type from {0} to {1}', [currentConflictType, newConflictType]];
    }

    protected effectMessage(context: C): MessageArgs {
        const currentConflictType = context.game.currentConflict && context.game.currentConflict.conflictType;
        const newConflictType =
            currentConflictType === ConflictType.Military ? ConflictType.Political : ConflictType.Military;
        return ['switch the conflict type from {0} to {1}', [newConflictType]];
    }

    protected effectMessageTarget(context: C): MsgArg {
        return context.game.currentConflict && context.game.currentConflict.conflictType;
    }

    canAffect(ring: Ring, context: C, _additionalProperties = {}) {
        if(!context.game.currentConflict) {
            return false;
        }
        const { targetConflictType } = this.getProperties(context);
        return ring.conflictType !== targetConflictType;
    }

    eventHandler(event: ActionEvent<EventName.OnSwitchConflictType, C>): void {
        const context = event.context;
        context.game.requireConflict().switchType();
    }
}
