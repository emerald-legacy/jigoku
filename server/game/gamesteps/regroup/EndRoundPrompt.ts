import type Player from '../../Player.js';
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

    menuCommand(_player: Player): boolean {
        this.completePlayer();
        return true;
    }
}
