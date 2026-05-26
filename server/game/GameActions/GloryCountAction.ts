import { AbilityContext } from '../AbilityContext.js';
import { EventNames } from '../Constants.js';
import Player from '../player.js';
import { GameAction, GameActionProperties } from './GameAction.js';

import type { Event } from '../Events/Event.js';
export interface GloryCountProperties extends GameActionProperties {
    gameAction: ((gloryCountWinner: Player | null, context: AbilityContext) => GameAction) | GameAction;
}

export class GloryCountAction extends GameAction<GloryCountProperties> {
    name = 'gloryCount';
    eventName = EventNames.OnGloryCount;

    hasLegalTarget(): boolean {
        return true;
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        events.push(this.getEvent(null, context, additionalProperties));
    }

    eventHandler(event: Event, additionalProperties: Record<string, unknown> = {}): void {
        let game = (event.context as AbilityContext).game;
        let properties = this.getProperties((event.context as AbilityContext), additionalProperties);

        let gloryTotals = game.getPlayersInFirstPlayerOrder().map((player: Player) => {
            return player.getGloryCount();
        });
        let winner: Player | null = game.getFirstPlayer() ?? null;
        if(winner && winner.opponent) {
            if(gloryTotals[0] === gloryTotals[1]) {
                game.addMessage('Both players are tied in glory at {0}.', gloryTotals[0]);
                game.raiseEvent(EventNames.OnFavorGloryTied);
                winner = null;
            } else if(gloryTotals[0] < gloryTotals[1]) {
                winner = winner.opponent;
                game.addMessage('{0} wins the glory count {1} vs {2}', winner, gloryTotals[1], gloryTotals[0]);
            } else {
                game.addMessage('{0} wins the glory count {1} vs {2}', winner, gloryTotals[0], gloryTotals[1]);
            }
        }

        let gameAction =
            typeof properties.gameAction === 'function'
                ? properties.gameAction(winner, (event.context as AbilityContext))
                : properties.gameAction;
        if(gameAction && gameAction.hasLegalTarget((event.context as AbilityContext)) && winner) {
            gameAction.resolve(undefined, (event.context as AbilityContext));
        }
    }
}
