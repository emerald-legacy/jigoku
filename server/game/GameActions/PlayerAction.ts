import type { AbilityContext } from '../AbilityContext.js';
import type Player from '../Player.js';
import { GameAction, type GameActionProperties, type ActionEvent } from './GameAction.js';
import type { EventName } from '../Constants.js';

export interface PlayerActionProperties extends GameActionProperties {
    target?: Player | Player[];
}

/** An event a player action created: it names the player it affects. */
export type PlayerEvent<N extends EventName, C extends AbilityContext> = ActionEvent<N, C> & { player: Player };

export class PlayerAction<P extends PlayerActionProperties = PlayerActionProperties, N extends EventName = EventName, C extends AbilityContext = AbilityContext> extends GameAction<P, N, C> {
    targetType = ['player'];

    defaultTargets(context: C): Player[] {
        return context.player && context.player.opponent ? [context.player.opponent] : [];
    }

    checkEventCondition(event: PlayerEvent<N, C>, additionalProperties: Record<string, unknown> = {}): boolean {
        return this.canAffect(event.player, event.context, additionalProperties);
    }

    addPropertiesToEvent(event: PlayerEvent<N, C>, player: Player, context: C, additionalProperties: Record<string, unknown> = {}): void {
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.player = player;
    }
}
