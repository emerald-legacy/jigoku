import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { ConflictType, EventName } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';
import type { ActionEvent, ActionOverrides } from './GameAction.js';

export interface SwitchConflictTypeProperties extends RingActionProperties {
    targetConflictType?: ConflictType;
}

export class SwitchConflictTypeAction<Context extends AbilityContext = AbilityContext> extends RingAction<SwitchConflictTypeProperties, EventName.OnSwitchConflictType, Context> {
    override name = 'switchConflictType';
    override eventName = EventName.OnSwitchConflictType;

    override getCostMessage(context: Context): MessageArgs {
        const currentConflictType = context.game.currentConflict && context.game.currentConflict.conflictType;
        const newConflictType =
            currentConflictType === ConflictType.Military ? ConflictType.Political : ConflictType.Military;
        return ['switching the conflict type from {0} to {1}', [currentConflictType, newConflictType]];
    }

    protected override effectMessage(context: Context): MessageArgs {
        const currentConflictType = context.game.currentConflict && context.game.currentConflict.conflictType;
        const newConflictType =
            currentConflictType === ConflictType.Military ? ConflictType.Political : ConflictType.Military;
        return ['switch the conflict type from {0} to {1}', [newConflictType]];
    }

    protected override effectMessageTarget(context: Context): MsgArg {
        return context.game.currentConflict && context.game.currentConflict.conflictType;
    }

    override canAffect(ring: Ring, context: Context, additionalProperties: ActionOverrides = {}) {
        if(!context.game.currentConflict) {
            return false;
        }
        const { targetConflictType } = this.getProperties(context, additionalProperties);
        return ring.conflictType !== targetConflictType;
    }

    override eventHandler(event: ActionEvent<EventName.OnSwitchConflictType, Context>): void {
        const context = event.context;
        context.game.requireConflict().switchType();
    }
}
