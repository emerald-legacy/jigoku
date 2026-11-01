import type Game from '../Game.js';
import { BaseStep } from './BaseStep.js';

export class SimpleStep extends BaseStep {
    constructor(game: Game, public continueFunc: () => void) {
        super(game);
    }

    override continue(): undefined {
        this.continueFunc();
        return undefined;
    }

    override getDebugInfo() {
        return this.continueFunc.toString();
    }
}
