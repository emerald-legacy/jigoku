import type { AbilityContext } from '../AbilityContext.js';
import type Player from '../Player.js';
import { GameAction, type GameActionProperties } from './GameAction.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { EventNames } from '../Constants.js';

export type PlayerActionProperties = GameActionProperties;

export class PlayerAction<P extends PlayerActionProperties = PlayerActionProperties, N extends EventNames = EventNames> extends GameAction<P, N> {
    targetType = ['player'];

    defaultTargets(context: AbilityContext): Player[] {
        return context.player && context.player.opponent ? [context.player.opponent] : [];
    }

    checkEventCondition(event: GameEvent<N>, additionalProperties: Record<string, unknown> = {}): boolean {
        return this.canAffect(event.player, (event.context as AbilityContext), additionalProperties);
    }

    addPropertiesToEvent(event: GameEvent<N>, player: Player, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.player = player;
    }
}
