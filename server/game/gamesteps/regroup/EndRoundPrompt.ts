import type Player from '../../player.js';
import { PlayerOrderPrompt } from '../PlayerOrderPrompt.js';

export class EndRoundPrompt extends PlayerOrderPrompt {
    activePrompt() {
        return {
            menuTitle: '',
            buttons: [{ text: 'End Round' }]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to end the round' };
    }

    onMenuCommand(player: Player): boolean {
        if(player !== this.currentPlayer) {
            return false;
        }

        this.completePlayer();
        return true;
    }
}
