import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import { ConflictType, EventName, RestrictionType } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';
import type { ActionEvent } from './GameAction.js';
import { takeFateFromRing } from './Shared/RingFate.js';

export interface ClaimRingProperties extends RingActionProperties {
    takeFate?: boolean;
    type?: ConflictType;
}

export class ClaimRingAction<C extends AbilityContext = AbilityContext> extends RingAction<ClaimRingProperties, EventName.OnClaimRing, C, 'takeFate' | 'type'> {
    override name = 'claimRing';
    override eventName = EventName.OnClaimRing;
    override effect = 'claim {0}';
    override defaultProperties = { takeFate: true, type: ConflictType.Military };

    override canAffect(ring: Ring, context: C): boolean {
        if(!context.player.checkRestrictions(RestrictionType.ClaimRings, context)) {
            return false;
        }

        return !ring.isRemovedFromGame() && ring.claimedBy !== context.player.name && super.canAffect(ring, context);
    }

    override eventHandler(event: ActionEvent<EventName.OnClaimRing, C>, additionalProperties: ActionOverrides = {}): void {
        const context = event.context;
        const { takeFate, type } = this.getProperties(context, additionalProperties);
        const ring = event.ring;
        ring.contested = false;
        ring.conflictType = type;
        if(takeFate) {
            takeFateFromRing(ring, context);
        }
        event.player = context.player;
        event.conflict = context.game.currentConflict ?? undefined;
        event.ring = ring;
        ring.claimRing(context.player);
    }
}
