import type { AbilityContext } from '../AbilityContext.js';
import { EventNames } from '../Constants.js';
import type Ring from '../ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';

export type ReturnRingToPlayProperties = RingActionProperties;

export class ReturnRingToPlayAction extends RingAction {
    name = 'returnRingToPlay';
    eventName = EventNames.OnReturnRingToPlay;
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

    eventHandler(event: any, _additionalProperties: Record<string, unknown> = {}): void {
        let ring = event.ring;
        let context = event.context;

        context.game.raiseEvent(EventNames.OnReturnRingToPlay, { ring: ring }, () => ring.returnRingToPlay());
    }
}
