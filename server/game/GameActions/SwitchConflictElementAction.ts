import type { GameEvent } from '../Events/EventPayloads.js';
import { AbilityContext } from '../AbilityContext.js';
import type { Conflict } from '../Conflict.js';
import { EventNames } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';

export type SwitchConflictElementProperties = RingActionProperties;

export class SwitchConflictElementAction extends RingAction {
    name = 'switchConflictElement';
    cost = 'switching the contested ring to {0}';
    effect = 'switch the contested ring to {0}';
    eventName = EventNames.OnSwitchConflictElement;

    canAffect(ring: Ring, context: AbilityContext, additionalProperties = {}): boolean {
        return (
            !ring.isRemovedFromGame() &&
            context.game.isDuringConflict() &&
            super.canAffect(ring, context, additionalProperties)
        );
    }

    eventHandler(event: GameEvent<EventNames.OnSwitchConflictElement>): void {
        const context = event.context as AbilityContext;
        (context.game.currentConflict as Conflict).switchElement(event.ring.element);
    }
}
