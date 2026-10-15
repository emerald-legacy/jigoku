import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import type Player from '../Player.js';
import { GameAction, type GameActionProperties, type ActionEvent } from './GameAction.js';
import type { EventName } from '../Constants.js';

export interface PlayerActionProperties extends GameActionProperties {
    target?: Player | Player[];
}

export type PlayerEvent<N extends EventName, C extends AbilityContext> = ActionEvent<N, C> & { player: Player };

export class PlayerAction<
    P extends PlayerActionProperties = PlayerActionProperties,
    N extends EventName = EventName,
    C extends AbilityContext = AbilityContext,
    D extends keyof P = never
> extends GameAction<P, N, C, D> {
    override targetType = ['player'];

    /** The ability's player; actions aimed at the opponent return `opponentTargets(context)`. */
    override defaultTargets(context: C): Player[] {
        return context.player ? [context.player] : [];
    }

    protected opponentTargets(context: C): Player[] {
        return context.player?.opponent ? [context.player.opponent] : [];
    }

    override checkEventCondition(event: PlayerEvent<N, C>, additionalProperties: ActionOverrides = {}): boolean {
        return this.canAffect(event.player, event.context, additionalProperties);
    }

    override addPropertiesToEvent(event: PlayerEvent<N, C>, player: Player, context: C, additionalProperties: ActionOverrides = {}): void {
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.player = player;
    }
}

/** Whether an action's players are just the ability's own player, whom its chat line doesn't name. */
export function onlyThePlayer(players: Player[], context: AbilityContext): boolean {
    return players.length === 0 || (players.length === 1 && players[0] === context.player);
}
