import Effect, { type EffectProperties } from './Effect.js';
import type BaseCard from '../BaseCard.js';
import type Game from '../Game.js';
import type { GameObject } from '../GameObject.js';
import type StaticEffect from './StaticEffect.js';

export default class ConflictEffect extends Effect {
    constructor(game: Game, source: BaseCard, properties: EffectProperties, effect: StaticEffect) {
        super(game, source, properties, effect);
        // Override any erroneous match passed through properties
        this.match = () => true;
    }

    getTargets(): GameObject[] {
        return this.game.currentConflict ? [this.game.currentConflict] : [];
    }
}
