import type Game from '../game.js';
import { BaseStep } from './BaseStep.js';

export class SimpleStep extends BaseStep {
    constructor(game: Game, public continueFunc: () => void) {
        super(game);
    }

    continue(): undefined {
        this.continueFunc();
        return undefined;
    }

    getDebugInfo() {
        return this.continueFunc.toString();
    }
}
