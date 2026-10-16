import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';
import type { ActionEvent } from './GameAction.js';
import { takeFateFromRing } from './Shared/RingFate.js';

export interface TakeRingProperties extends RingActionProperties {
    takeFate?: boolean;
}

export class TakeRingAction<Context extends AbilityContext = AbilityContext> extends RingAction<TakeRingProperties, EventName.OnTakeRing, Context, 'takeFate'> {
    override name = 'takeRing';
    override eventName = EventName.OnTakeRing;
    override effect = 'take {0}';
    override defaultProperties = { takeFate: true };
    override canAffect(ring: Ring, context: Context): boolean {
        return !ring.isRemovedFromGame() && ring.claimedBy !== context.player.name && super.canAffect(ring, context);
    }

    override eventHandler(event: ActionEvent<EventName.OnTakeRing, Context>, additionalProperties: ActionOverrides = {}): void {
        const context = event.context;
        const { takeFate } = this.getProperties(context, additionalProperties);
        const ring = event.ring;
        ring.claimRing(context.player);
        ring.contested = false;
        if(takeFate) {
            takeFateFromRing(ring, context);
        }
    }
}
