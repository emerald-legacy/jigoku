import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';

import type { ActionEvent } from './GameAction.js';
export type ReturnRingToPlayProperties = RingActionProperties;

export class ReturnRingToPlayAction<C extends AbilityContext = AbilityContext> extends RingAction<ReturnRingToPlayProperties, EventName.OnReturnRingToPlay, C> {
    name = 'returnRingToPlay';
    eventName = EventName.OnReturnRingToPlay;
    effect = 'return the {0} to play';
    constructor(properties: ((context: C) => ReturnRingToPlayProperties) | ReturnRingToPlayProperties) {
        super(properties);
    }

    canAffect(ring: Ring, context: C): boolean {
        if(!ring.removedFromGame) {
            return false;
        }

        return super.canAffect(ring, context);
    }

    eventHandler(event: ActionEvent<EventName.OnReturnRingToPlay, C>, _additionalProperties: Record<string, unknown> = {}): void {
        const ring = event.ring;
        const context = event.context;

        context.game.raiseEvent(EventName.OnReturnRingToPlay, { ring: ring }, () => ring.returnRingToPlay());
    }
}
