import type { AbilityContext } from '../AbilityContext.js';
import type Ring from '../Ring.js';
import { GameAction, type GameActionProperties, type ActionEvent } from './GameAction.js';
import type { EventName } from '../Constants.js';

export type RingActionProperties = GameActionProperties;

/** An event a ring action created: it names the ring it affects. */
export type RingEvent<N extends EventName, C extends AbilityContext> = ActionEvent<N, C> & { ring: Ring };

export class RingAction<P extends RingActionProperties = RingActionProperties, N extends EventName = EventName, C extends AbilityContext = AbilityContext> extends GameAction<P, N, C> {
    targetType = ['ring'];

    defaultTargets(context: C): Ring[] {
        return context.game.currentConflict && context.game.currentConflict.ring ? [context.game.currentConflict.ring] : [];
    }

    checkEventCondition(event: RingEvent<N, C>, additionalProperties = {}): boolean {
        return this.canAffect(event.ring, event.context, additionalProperties);
    }

    addPropertiesToEvent(event: RingEvent<N, C>, ring: Ring, context: C, additionalProperties: Record<string, unknown> = {}): void {
        super.addPropertiesToEvent(event, ring, context, additionalProperties);
        event.ring = ring;
    }
}
