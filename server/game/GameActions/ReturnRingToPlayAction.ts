import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';

import type { GameEvent } from '../Events/EventPayloads.js';
export type ReturnRingToPlayProperties = RingActionProperties;

export class ReturnRingToPlayAction extends RingAction {
    name = 'returnRingToPlay';
    eventName = EventName.OnReturnRingToPlay;
    effect = 'return the {0} to play';
    constructor(properties: ((context: AbilityContext) => ReturnRingToPlayProperties) | ReturnRingToPlayProperties) {
        super(properties);
    }

    canAffect(ring: Ring, context: AbilityContext): boolean {
        if(!ring.removedFromGame) {
            return false;
        }

        return super.canAffect(ring, context);
    }

    eventHandler(event: GameEvent<EventName.OnReturnRingToPlay>, _additionalProperties: Record<string, unknown> = {}): void {
        const ring = event.ring;
        const context = event.context as AbilityContext;

        context.game.raiseEvent(EventName.OnReturnRingToPlay, { ring: ring }, () => ring.returnRingToPlay());
    }
}
