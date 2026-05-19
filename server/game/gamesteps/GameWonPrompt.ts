import { AllPlayerPrompt } from './AllPlayerPrompt.js';
import type Player from '../player.js';

class GameWonPrompt extends AllPlayerPrompt {
    winner: any;
    clickedButton: Record<string, boolean>;

    constructor(game: any, winner: any) {
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
