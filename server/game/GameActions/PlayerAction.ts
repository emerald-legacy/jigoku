import type { AbilityContext } from '../AbilityContext.js';
import type Player from '../Player.js';
import { GameAction, type GameActionProperties, type ActionEvent } from './GameAction.js';
import type { EventName } from '../Constants.js';

export type PlayerActionProperties = GameActionProperties;

export class PlayerAction<P extends PlayerActionProperties = PlayerActionProperties, N extends EventName = EventName, C extends AbilityContext = AbilityContext> extends GameAction<P, N, C> {
    targetType = ['player'];

    defaultTargets(context: C): Player[] {
        return context.player && context.player.opponent ? [context.player.opponent] : [];
    }

    checkEventCondition(event: ActionEvent<N, C>, additionalProperties: Record<string, unknown> = {}): boolean {
        return this.canAffect((event as { player: Player }).player, event.context, additionalProperties);
    }

    addPropertiesToEvent(event: ActionEvent<N, C>, player: Player, context: C, additionalProperties: Record<string, unknown> = {}): void {
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        (event as { player: Player }).player = player;
    }
}
