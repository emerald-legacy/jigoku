import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import { type ConflictType, EventName, RestrictionType } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';
import type { ActionEvent } from './GameAction.js';
import { takeAllFateFromRing } from './TakeFateFromRingAction.js';

export interface ClaimRingProperties extends RingActionProperties {
    takeFate?: boolean;
    /** The side the ring is put in the claimed pool with. */
    conflictType: ConflictType;
}

export class ClaimRingAction<Context extends AbilityContext = AbilityContext> extends RingAction<ClaimRingProperties, EventName.OnClaimRing, Context, 'takeFate'> {
    override name = 'claimRing';
    override eventName = EventName.OnClaimRing;
    override effect = 'claim {0}';
    override defaultProperties = { takeFate: true };

    override canAffect(ring: Ring, context: Context): boolean {
        if(!context.player.checkRestrictions(RestrictionType.ClaimRings, context)) {
            return false;
        }

        return !ring.isRemovedFromGame() && ring.claimedBy !== context.player.name && super.canAffect(ring, context);
    }

    override eventHandler(event: ActionEvent<EventName.OnClaimRing, Context>, additionalProperties: ActionOverrides = {}): void {
        const context = event.context;
        const { takeFate, conflictType } = this.getProperties(context, additionalProperties);
        const ring = event.ring;
        ring.contested = false;
        ring.conflictType = conflictType;
        if(takeFate) {
            context.game.openThenEventWindow(takeAllFateFromRing(ring, context));
        }
        event.player = context.player;
        event.conflict = context.game.currentConflict ?? undefined;
        event.ring = ring;
        ring.claimRing(context.player);
    }
}
