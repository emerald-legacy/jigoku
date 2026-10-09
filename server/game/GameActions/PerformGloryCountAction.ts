import { msg } from '../GameChat.js';
import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Player from '../Player.js';
import { GameAction, type GameActionProperties, type ActionEvent } from './GameAction.js';
import type { Event } from '../Events/Event.js';

export interface GloryCountProperties extends GameActionProperties {
    gameAction: ((gloryCountWinner: Player | null, context: AbilityContext) => GameAction | null) | GameAction;
}

export class PerformGloryCountAction<C extends AbilityContext = AbilityContext> extends GameAction<GloryCountProperties, EventName.OnGloryCount, C> {
    name = 'performGloryCount';
    eventName = EventName.OnGloryCount;

    hasLegalTarget(_context: C): boolean {
        return true;
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        events.push(this.getEvent(null, context, additionalProperties));
    }

    eventHandler(event: ActionEvent<EventName.OnGloryCount, C>, additionalProperties: ActionOverrides = {}): void {
        const game = event.context.game;
        const properties = this.getProperties(event.context, additionalProperties);

        const gloryTotals = game.getPlayersInFirstPlayerOrder().map((player) => {
            return player.getGloryCount();
        });
        let winner: Player | null = game.getFirstPlayer() ?? null;
        if(winner && winner.opponent) {
            if(gloryTotals[0] === gloryTotals[1]) {
                game.addMessage(msg`Both players are tied in glory at ${gloryTotals[0]}.`);
                game.raiseEvent(EventName.OnFavorGloryTied);
                winner = null;
            } else if(gloryTotals[0] < gloryTotals[1]) {
                winner = winner.opponent;
                game.addMessage(msg`${winner} wins the glory count ${gloryTotals[1]} vs ${gloryTotals[0]}`);
            } else {
                game.addMessage(msg`${winner} wins the glory count ${gloryTotals[0]} vs ${gloryTotals[1]}`);
            }
        }

        const gameAction =
            typeof properties.gameAction === 'function'
                ? properties.gameAction(winner, event.context)
                : properties.gameAction;
        if(gameAction && gameAction.hasLegalTarget(event.context) && winner) {
            gameAction.resolve(undefined, event.context);
        }
    }
}
