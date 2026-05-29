import type { AbilityContext } from '../AbilityContext.js';
import { EventNames } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';

import type { Event } from '../Events/Event.js';
export interface TakeRingProperties extends RingActionProperties {
    takeFate?: boolean;
}

export class TakeRingAction extends RingAction {
    name = 'takeFate';
    eventName = EventNames.OnTakeRing;
    effect = 'take {0}';
    defaultProperties: TakeRingProperties = { takeFate: true };
    constructor(properties: ((context: AbilityContext) => TakeRingProperties) | TakeRingProperties) {
        super(properties);
    }

    canAffect(ring: Ring, context: AbilityContext): boolean {
        return !ring.isRemovedFromGame() && ring.claimedBy !== context.player.name && super.canAffect(ring, context);
    }

    eventHandler(event: Event, additionalProperties: Record<string, unknown> = {}): void {
        let { takeFate } = this.getProperties((event.context as AbilityContext), additionalProperties) as TakeRingProperties;
        let ring = event.ring;
        let context = (event.context as AbilityContext);
        ring.claimRing(context.player);
        ring.contested = false;
        if(takeFate && context.player.checkRestrictions('takeFateFromRings', context)) {
            context.game.addMessage('{0} takes {1} fate from {2}', context.player, ring.fate, ring);
            context.player.modifyFate(ring.fate);
            ring.removeFate();
        }
    }
}
