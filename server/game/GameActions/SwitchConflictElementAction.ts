import { AbilityContext } from '../AbilityContext.js';
import type { Conflict } from '../Conflict.js';
import { EventName } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';
import type { ActionEvent } from './GameAction.js';

export type SwitchConflictElementProperties = RingActionProperties;

export class SwitchConflictElementAction<C extends AbilityContext = AbilityContext> extends RingAction<SwitchConflictElementProperties, EventName, C> {
    name = 'switchConflictElement';
    cost = 'switching the contested ring to {0}';
    effect = 'switch the contested ring to {0}';
    eventName = EventName.OnSwitchConflictElement;

    canAffect(ring: Ring, context: C, additionalProperties = {}): boolean {
        return (
            !ring.isRemovedFromGame() &&
            context.game.isDuringConflict() &&
            super.canAffect(ring, context, additionalProperties)
        );
    }

    eventHandler(event: ActionEvent<EventName.OnSwitchConflictElement, C>): void {
        const context = event.context;
        (context.game.currentConflict as Conflict).switchElement(event.ring.element);
    }
}
