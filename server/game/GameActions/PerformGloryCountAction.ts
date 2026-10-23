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

export class PerformGloryCountAction<Context extends AbilityContext = AbilityContext> extends GameAction<GloryCountProperties, EventName.OnGloryCount, Context> {
    override name = 'performGloryCount';
    override eventName = EventName.OnGloryCount;

    override hasLegalTarget(_context: Context): boolean {
        return true;
    }

    override addEventsToArray(events: Event[], context: Context, additionalProperties: ActionOverrides = {}): void {
        events.push(this.getEvent(null, context, additionalProperties));
    }

    override eventHandler(event: ActionEvent<EventName.OnGloryCount, Context>, additionalProperties: ActionOverrides = {}): void {
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

        if(!winner) {
            return;
        }
        // the rule's own count (no card) acts for its winner, as the Imperial Favor claim does
        const context = event.context.source.isCard() ? event.context : game.getFrameworkContext(winner);
        const gameAction =
            typeof properties.gameAction === 'function'
                ? properties.gameAction(winner, context)
                : properties.gameAction;
        if(gameAction && gameAction.hasLegalTarget(context)) {
            gameAction.resolve(undefined, context);
        }
    }
}
