import type { AbilityContext } from '../AbilityContext.js';
import { EventNames } from '../Constants.js';
import type Ring from '../ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';

export type ReturnRingProperties = RingActionProperties;

export class ReturnRingAction extends RingAction {
    name = 'returnRing';
    eventName = EventNames.OnReturnRing;
    effect = 'return {0} to the unclaimed pool';

    canAffect(ring: Ring, context: AbilityContext): boolean {
        return !ring.isUnclaimed() && super.canAffect(ring, context);
    }

    eventHandler(event: any): void {
        event.ring.resetRing();
    }
}
