import type { AbilityContext } from '../AbilityContext.js';
import type Ring from '../Ring.js';
import { GameAction, type GameActionProperties } from './GameAction.js';

import type { Event } from '../Events/Event.js';
export type RingActionProperties = GameActionProperties;

export class RingAction<P extends RingActionProperties = RingActionProperties> extends GameAction<P> {
    targetType = ['ring'];

    defaultTargets(context: AbilityContext): Ring[] {
        return context.game.currentConflict && context.game.currentConflict.ring ? [context.game.currentConflict.ring] : [];
    }

    checkEventCondition(event: Event, additionalProperties = {}): boolean {
        return this.canAffect(event.ring, (event.context as AbilityContext), additionalProperties);
    }

    addPropertiesToEvent(event: Event, ring: Ring, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        super.addPropertiesToEvent(event, ring, context, additionalProperties);
        event.ring = ring;
    }
}
