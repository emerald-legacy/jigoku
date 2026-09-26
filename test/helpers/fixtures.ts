// the game module first: it loads the engine in an order that resolves its import cycles
import GameFlowWrapper from './gameflowwrapper.js';
import type Game from '../../server/game/Game.js';
import DrawCard from '../../server/game/DrawCard.js';
import { CardType } from '../../server/game/Constants.js';
import type Player from '../../server/game/Player.js';

/** A real two-player game that has not started, for unit specs that need engine objects. */
export function createTestGame(): Game {
    return new GameFlowWrapper().game;
}

export function testPlayer(game: Game, name: 'player1' | 'player2' = 'player1'): Player {
    const player = game.getPlayerByName(name);
    if(!player) {
        throw new Error(`${name} is missing from the test game`);
    }
    return player;
}

/** A plain character owned by `player1`, outside any deck. */
export function createTestCharacter(game: Game, name = 'Test'): DrawCard {
    return new DrawCard(testPlayer(game), { id: name.toLowerCase(), name, type: CardType.Character });
}
