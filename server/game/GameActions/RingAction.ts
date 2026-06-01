import type { AbilityContext } from '../AbilityContext.js';
import type Ring from '../Ring.js';
import { GameAction, type GameActionProperties } from './GameAction.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { EventNames } from '../Constants.js';

export type RingActionProperties = GameActionProperties;

export class RingAction<P extends RingActionProperties = RingActionProperties, N extends EventNames = EventNames> extends GameAction<P, N> {
    targetType = ['ring'];

    defaultTargets(context: AbilityContext): Ring[] {
        return context.game.currentConflict && context.game.currentConflict.ring ? [context.game.currentConflict.ring] : [];
    }

    checkEventCondition(event: GameEvent<N>, additionalProperties = {}): boolean {
        return this.canAffect((event as { ring: Ring }).ring, (event.context as AbilityContext), additionalProperties);
    }

    addPropertiesToEvent(event: GameEvent<N>, ring: Ring, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        super.addPropertiesToEvent(event, ring, context, additionalProperties);
        (event as { ring: Ring }).ring = ring;
    }
}
