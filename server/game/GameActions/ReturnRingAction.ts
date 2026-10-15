import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';
import type { ActionEvent } from './GameAction.js';

export type ReturnRingProperties = RingActionProperties;

export class ReturnRingAction<C extends AbilityContext = AbilityContext> extends RingAction<ReturnRingProperties, EventName.OnReturnRing, C> {
    override name = 'returnRing';
    override eventName = EventName.OnReturnRing;
    override effect = 'return {0} to the unclaimed pool';

    override canAffect(ring: Ring, context: C): boolean {
        return !ring.isUnclaimed() && super.canAffect(ring, context);
    }

    override eventHandler(event: ActionEvent<EventName.OnReturnRing, C>): void {
        event.ring.resetRing();
    }
}
