import { AllPlayerPrompt } from './AllPlayerPrompt.js';
import type Player from '../Player.js';
import type Game from '../Game.js';

class GameWonPrompt extends AllPlayerPrompt {
    winner: Player;
    clickedButton: Record<string, boolean>;

    constructor(game: Game, winner: Player) {
        super(game);
        this.winner = winner;
        this.clickedButton = {};
    }

    completionCondition(player: Player): boolean {
        return !!this.clickedButton[player.name];
    }

    activePrompt() {
        return {
            promptTitle: 'Game Won',
            menuTitle: this.winner.name + ' has won the game!',
            buttons: [{ text: 'Continue Playing' }]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose to continue' };
    }

    menuCommand(player: Player): boolean {
        this.game.addMessage('{0} wants to continue', player);

        this.clickedButton[player.name] = true;

        return true;
    }
}

export default GameWonPrompt;
