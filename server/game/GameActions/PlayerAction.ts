import type { AbilityContext } from '../AbilityContext.js';
import type Player from '../Player.js';
import { GameAction, type GameActionProperties } from './GameAction.js';

import type { Event } from '../Events/Event.js';
export type PlayerActionProperties = GameActionProperties;

export class PlayerAction<P extends PlayerActionProperties = PlayerActionProperties> extends GameAction<P> {
    targetType = ['player'];

    defaultTargets(context: AbilityContext): Player[] {
        return context.player && context.player.opponent ? [context.player.opponent] : [];
    }

    checkEventCondition(event: Event, additionalProperties: Record<string, unknown> = {}): boolean {
        return this.canAffect(event.player, (event.context as AbilityContext), additionalProperties);
    }

    addPropertiesToEvent(event: Event, player: Player, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.player = player;
    }
}
