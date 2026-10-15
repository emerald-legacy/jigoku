import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';
import type { ActionEvent } from './GameAction.js';

export type SwitchConflictElementProperties = RingActionProperties;

export class SwitchConflictElementAction<C extends AbilityContext = AbilityContext> extends RingAction<SwitchConflictElementProperties, EventName.OnSwitchConflictElement, C> {
    override name = 'switchConflictElement';
    override cost = 'switching the contested ring to {0}';
    override effect = 'switch the contested ring to {0}';
    override eventName = EventName.OnSwitchConflictElement;

    override canAffect(ring: Ring, context: C, additionalProperties: ActionOverrides = {}): boolean {
        return (
            !ring.isRemovedFromGame() &&
            context.game.isDuringConflict() &&
            super.canAffect(ring, context, additionalProperties)
        );
    }

    override eventHandler(event: ActionEvent<EventName.OnSwitchConflictElement, C>): void {
        const context = event.context;
        context.game.requireConflict().switchElement(event.ring.element);
    }
}
