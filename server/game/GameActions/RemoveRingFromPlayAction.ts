import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';

import type { ActionEvent } from './GameAction.js';
export type RemoveRingFromPlayProperties = RingActionProperties;

export class RemoveRingFromPlayAction<C extends AbilityContext = AbilityContext> extends RingAction<RemoveRingFromPlayProperties, EventName.OnRemoveRingFromPlay, C> {
    name = 'removeRingFromPlay';
    eventName = EventName.OnRemoveRingFromPlay;
    effect = 'remove the {0} from play';
    constructor(
        properties: ((context: C) => RemoveRingFromPlayProperties) | RemoveRingFromPlayProperties
    ) {
        super(properties);
    }

    canAffect(ring: Ring, context: C): boolean {
        if(ring.removedFromGame) {
            return false;
        }

        return super.canAffect(ring, context);
    }

    eventHandler(event: ActionEvent<EventName.OnRemoveRingFromPlay, C>, _additionalProperties: Record<string, unknown> = {}): void {
        const ring = event.ring;
        const context = event.context;

        context.game.raiseEvent(EventName.OnRemoveRingFromPlay, { ring: ring }, () => ring.removeRingFromPlay());
    }
}
