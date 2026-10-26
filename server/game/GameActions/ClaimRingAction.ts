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
    /** The conflict's own claim: the ring stays contested while the claim resolves, and the rules reset it afterwards. */
    staysContested?: boolean;
}

export class ClaimRingAction<Context extends AbilityContext = AbilityContext> extends RingAction<ClaimRingProperties, EventName.OnClaimRing, Context, 'takeFate' | 'staysContested'> {
    override name = 'claimRing';
    override eventName = EventName.OnClaimRing;
    override effect = 'claim {0}';
    override defaultProperties = { takeFate: true, staysContested: false };

    override canAffect(ring: Ring, context: Context): boolean {
        if(!context.player.checkRestrictions(RestrictionType.ClaimRings, context)) {
            return false;
        }

        return !ring.isRemovedFromGame() && !ring.isClaimedBy(context.player) && super.canAffect(ring, context);
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnClaimRing, Context>, ring: Ring, context: Context, additionalProperties: ActionOverrides = {}): void {
        super.addPropertiesToEvent(event, ring, context, additionalProperties);
        // set before the handler: Henshin Mysteries cancels the claim of a conflict's ring
        event.player = context.player;
        event.conflict = context.game.currentConflict ?? undefined;
    }

    override eventHandler(event: ActionEvent<EventName.OnClaimRing, Context>, additionalProperties: ActionOverrides = {}): void {
        const context = event.context;
        const { takeFate, conflictType, staysContested } = this.getProperties(context, additionalProperties);
        const ring = event.ring;
        if(!staysContested) {
            ring.contested = false;
        }
        ring.conflictType = conflictType;
        if(takeFate) {
            context.game.openThenEventWindow(takeAllFateFromRing(ring, context));
        }
        ring.claimRing(context.player);
    }
}
