import type { AbilityContext } from '../AbilityContext.js';
import { EventNames } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';

import type { GameEvent } from '../Events/EventPayloads.js';
export type RemoveRingFromPlayProperties = RingActionProperties;

export class RemoveRingFromPlayAction extends RingAction {
    name = 'removeRingFromPlay';
    eventName = EventNames.OnRemoveRingFromPlay;
    effect = 'remove the {0} from play';
    constructor(
        properties: ((context: AbilityContext) => RemoveRingFromPlayProperties) | RemoveRingFromPlayProperties
    ) {
        super(properties);
    }

    canAffect(ring: Ring, context: AbilityContext): boolean {
        if(ring.removedFromGame) {
            return false;
        }

        return super.canAffect(ring, context);
    }

    eventHandler(event: GameEvent<EventNames.OnRemoveRingFromPlay>, _additionalProperties: Record<string, unknown> = {}): void {
        const ring = event.ring;
        const context = event.context as AbilityContext;

        context.game.raiseEvent(EventNames.OnRemoveRingFromPlay, { ring: ring }, () => ring.removeRingFromPlay());
    }
}
