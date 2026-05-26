import type { AbilityContext } from '../AbilityContext.js';
import { EventNames } from '../Constants.js';
import type Ring from '../ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';

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

    eventHandler(event: any, _additionalProperties: Record<string, unknown> = {}): void {
        let ring = event.ring;
        let context = event.context;

        context.game.raiseEvent(EventNames.OnRemoveRingFromPlay, { ring: ring }, () => ring.removeRingFromPlay());
    }
}
