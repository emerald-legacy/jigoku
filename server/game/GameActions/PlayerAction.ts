import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import type Player from '../Player.js';
import { GameAction, type GameActionProperties, type ActionEvent } from './GameAction.js';
import { type EventName, ObjectType } from '../Constants.js';

export interface PlayerActionProperties extends GameActionProperties {
    target?: Player | Player[];
}

export type PlayerEvent<EventType extends EventName, Context extends AbilityContext> = ActionEvent<EventType, Context> & { player: Player };

export class PlayerAction<
    Properties extends PlayerActionProperties = PlayerActionProperties,
    EventType extends EventName = EventName,
    Context extends AbilityContext = AbilityContext,
    Defaulted extends keyof Properties = never
> extends GameAction<Properties, EventType, Context, Defaulted> {
    override targetType = [ObjectType.Player];

    /** The ability's player; actions aimed at the opponent return `opponentTargets(context)`. */
    override defaultTargets(context: Context): Player[] {
        return [context.player];
    }

    protected opponentTargets(context: Context): Player[] {
        return context.player.opponent ? [context.player.opponent] : [];
    }

    override checkEventCondition(event: PlayerEvent<EventType, Context>, additionalProperties: ActionOverrides = {}): boolean {
        return this.canAffect(event.player, event.context, additionalProperties);
    }

    override addPropertiesToEvent(event: PlayerEvent<EventType, Context>, player: Player, context: Context, additionalProperties: ActionOverrides = {}): void {
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.player = player;
    }
}

/** Whether an action's players are just the ability's own player, whom its chat line doesn't name. */
export function onlyThePlayer(players: Player[], context: AbilityContext): boolean {
    return players.length === 0 || (players.length === 1 && players[0] === context.player);
}
