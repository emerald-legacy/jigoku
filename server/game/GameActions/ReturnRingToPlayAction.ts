import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Ring from '../Ring.js';
import { RingAction, type RingActionProperties } from './RingAction.js';
import type { ActionEvent, ActionOverrides } from './GameAction.js';

export type ReturnRingToPlayProperties = RingActionProperties;

export class ReturnRingToPlayAction<Context extends AbilityContext = AbilityContext> extends RingAction<ReturnRingToPlayProperties, EventName.OnReturnRingToPlay, Context> {
    override name = 'returnRingToPlay';
    override eventName = EventName.OnReturnRingToPlay;
    override effect = 'return the {0} to play';
    override canAffect(ring: Ring, context: Context): boolean {
        if(!ring.removedFromGame) {
            return false;
        }

        return super.canAffect(ring, context);
    }

    override eventHandler(event: ActionEvent<EventName.OnReturnRingToPlay, Context>, _additionalProperties: ActionOverrides = {}): void {
        const ring = event.ring;
        const context = event.context;

        context.game.raiseEvent(EventName.OnReturnRingToPlay, { ring: ring }, () => ring.returnRingToPlay());
    }
}
