import type Game from './Game.js';
import type Player from './player.js';

export interface GameRouter {
    handleError(game: Game, e: Error): void;
    gameWon(game: Game, reason: string, winner: Player): void;
}
