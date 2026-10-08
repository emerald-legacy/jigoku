import { msg } from '../GameChat.js';
import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import { ConflictType, EventName } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';
import type { ActionEvent } from './GameAction.js';

export interface ClaimRingProperties extends RingActionProperties {
    takeFate?: boolean;
    type?: ConflictType;
}

export class ClaimRingAction<C extends AbilityContext = AbilityContext> extends RingAction<ClaimRingProperties, EventName.OnClaimRing, C, 'takeFate' | 'type'> {
    name = 'claimRing';
    eventName = EventName.OnClaimRing;
    effect = 'claim {0}';
    defaultProperties = { takeFate: true, type: ConflictType.Military };

    canAffect(ring: Ring, context: C): boolean {
        if(!context.player.checkRestrictions('claimRings', context)) {
            return false;
        }

        return !ring.isRemovedFromGame() && ring.claimedBy !== context.player.name && super.canAffect(ring, context);
    }

    eventHandler(event: ActionEvent<EventName.OnClaimRing, C>, additionalProperties: ActionOverrides = {}): void {
        const context = event.context;
        const { takeFate, type } = this.getProperties(context, additionalProperties);
        const ring = event.ring;
        ring.contested = false;
        ring.conflictType = type;
        if(takeFate && ring.fate > 0 && context.player.checkRestrictions('takeFateFromRings', context)) {
            context.game.addMessage(msg`${context.player} takes ${ring.fate} fate from ${ring}`);
            const fate = ring.fate;
            context.player.modifyFate(ring.fate);
            ring.removeFate();
            context.game.raiseEvent(EventName.OnMoveFate, {
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
