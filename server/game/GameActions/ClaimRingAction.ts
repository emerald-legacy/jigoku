import type { AbilityContext } from '../AbilityContext.js';
import { ConflictTypes, EventNames } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';

import type { Event } from '../Events/Event.js';
export interface ClaimRingProperties extends RingActionProperties {
    takeFate?: boolean;
    type?: string;
}

export class ClaimRingAction extends RingAction<ClaimRingProperties> {
    name = 'claimRing';
    eventName = EventNames.OnClaimRing;
    effect = 'claim {0}';
    defaultProperties: ClaimRingProperties = { takeFate: true, type: ConflictTypes.Military };

    canAffect(ring: Ring, context: AbilityContext): boolean {
        if(!context.player.checkRestrictions('claimRings', context)) {
            return false;
        }

        return !ring.isRemovedFromGame() && ring.claimedBy !== context.player.name && super.canAffect(ring, context);
    }

    eventHandler(event: Event, additionalProperties: Record<string, unknown> = {}): void {
        let context = event.context as AbilityContext;
        let { takeFate, type } = this.getProperties(context, additionalProperties) as ClaimRingProperties;
        let ring = event.ring as Ring;
        ring.contested = false;
        ring.conflictType = type as ConflictTypes;
        if(takeFate && ring.fate > 0 && context.player.checkRestrictions('takeFateFromRings', context)) {
            context.game.addMessage('{0} takes {1} fate from {2}', context.player, ring.fate, ring);
            let fate = ring.fate;
            context.player.modifyFate(ring.fate);
            ring.removeFate();
            context.game.raiseEvent(EventNames.OnMoveFate, {
                fate: fate,
                origin: ring,
                context: context,
                recipient: context.player
            });
        }
        event.player = context.player;
        event.conflict = context.game.currentConflict ?? undefined;
        event.ring = ring;
        ring.claimRing(context.player);
    }
}
