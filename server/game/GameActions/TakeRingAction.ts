import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';

import type { ActionEvent } from './GameAction.js';
export interface TakeRingProperties extends RingActionProperties {
    takeFate?: boolean;
}

export class TakeRingAction<C extends AbilityContext = AbilityContext> extends RingAction<TakeRingProperties, EventName.OnTakeRing, C> {
    name = 'takeFate';
    eventName = EventName.OnTakeRing;
    effect = 'take {0}';
    defaultProperties: TakeRingProperties = { takeFate: true };
    constructor(properties: ((context: C) => TakeRingProperties) | TakeRingProperties) {
        super(properties);
    }

    canAffect(ring: Ring, context: C): boolean {
        return !ring.isRemovedFromGame() && ring.claimedBy !== context.player.name && super.canAffect(ring, context);
    }

    eventHandler(event: ActionEvent<EventName.OnTakeRing, C>, additionalProperties: Record<string, unknown> = {}): void {
        const context = event.context;
        const { takeFate } = this.getProperties(context, additionalProperties);
        const ring = event.ring;
        ring.claimRing(context.player);
        ring.contested = false;
        if(takeFate && context.player.checkRestrictions('takeFateFromRings', context)) {
            context.game.addMessage('{0} takes {1} fate from {2}', context.player, ring.fate, ring);
            context.player.modifyFate(ring.fate);
            ring.removeFate();
        }
    }
}
