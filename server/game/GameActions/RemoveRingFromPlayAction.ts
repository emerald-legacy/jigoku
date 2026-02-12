import type { AbilityContext } from '../AbilityContext';
import { EventNames } from '../Constants';
import type Ring from '../ring';
import { RingAction, type RingActionProperties } from './RingAction';

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

    eventHandler(event, _additionalProperties): void {
        let ring = event.ring;
        let context = event.context;

        context.game.raiseEvent(EventNames.OnRemoveRingFromPlay, { ring: ring }, () => ring.removeRingFromPlay());
    }
}
