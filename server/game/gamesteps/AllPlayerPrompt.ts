import type Player from '../Player.js';
import { UiPrompt } from './UiPrompt.js';

export class AllPlayerPrompt extends UiPrompt {
    activeCondition(player: Player) {
        return !this.completionCondition(player);
    }

    completionCondition(_player: Player) {
        return false;
    }

    isComplete() {
        return this.game.getPlayers().every(player => this.completionCondition(player));
    }
}
