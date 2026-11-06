import type Player from '../../Player.js';
import { PlayerOrderPrompt } from '../PlayerOrderPrompt.js';

export class EndRoundPrompt extends PlayerOrderPrompt {
    override activePrompt() {
        return {
            menuTitle: '',
            buttons: [{ text: 'End Round' }]
        };
    }

    override waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to end the round' };
    }

    override menuCommand(_player: Player): boolean {
        this.completePlayer();
        return true;
    }
}
