import Effect from './Effect.js';
import type Game from '../game.js';

export default class DuelEffect extends Effect {
    duel: any;

    constructor(game: Game, source: any, properties: any, effect: any) {
        super(game, source, properties, effect);
        // Override any erroneous match passed through properties
        this.match = () => true;
        this.duel = properties.target[0];
    }

    getTargets(): any[] {
        return this.duel ? [this.duel] : [];
    }
}
