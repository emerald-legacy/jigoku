import type { AbilityContext } from '../AbilityContext.js';
import type Ring from '../Ring.js';
import { GameAction, type GameActionProperties, type ActionEvent } from './GameAction.js';
import type { EventName } from '../Constants.js';

export type RingActionProperties = GameActionProperties;

export class RingAction<P extends RingActionProperties = RingActionProperties, N extends EventName = EventName, C extends AbilityContext = AbilityContext> extends GameAction<P, N, C> {
    targetType = ['ring'];

    defaultTargets(context: C): Ring[] {
        return context.game.currentConflict && context.game.currentConflict.ring ? [context.game.currentConflict.ring] : [];
    }

    checkEventCondition(event: ActionEvent<N, C>, additionalProperties = {}): boolean {
        return this.canAffect((event as { ring: Ring }).ring, (event.context), additionalProperties);
    }

    addPropertiesToEvent(event: ActionEvent<N, C>, ring: Ring, context: C, additionalProperties: Record<string, unknown> = {}): void {
        super.addPropertiesToEvent(event, ring, context, additionalProperties);
        (event as { ring: Ring }).ring = ring;
    }
}
