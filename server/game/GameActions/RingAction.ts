import type { AbilityContext } from '../AbilityContext.js';
import type Ring from '../ring.js';
import { GameAction, type GameActionProperties } from './GameAction.js';

export type RingActionProperties = GameActionProperties;

export class RingAction<P extends RingActionProperties = RingActionProperties> extends GameAction<P> {
    targetType = ['ring'];

    defaultTargets(context: AbilityContext): Ring[] {
        return context.game.currentConflict ? [context.game.currentConflict.ring] : [];
    }

    checkEventCondition(event: any, additionalProperties = {}): boolean {
        return this.canAffect(event.ring, event.context, additionalProperties);
    }

    addPropertiesToEvent(event, ring: Ring, context: AbilityContext, additionalProperties): void {
        super.addPropertiesToEvent(event, ring, context, additionalProperties);
        event.ring = ring;
    }
}
