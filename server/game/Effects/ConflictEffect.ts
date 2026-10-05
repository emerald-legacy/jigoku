import Effect, { type EffectProperties } from './Effect.js';
import type { EffectName } from '../Constants.js';
import type { Conflict } from '../Conflict.js';
import type EffectSource from '../EffectSource.js';
import type Game from '../Game.js';
import type { EffectBase } from './EffectBase.js';

export default class ConflictEffect extends Effect<Conflict> {
    constructor(game: Game, source: EffectSource, properties: EffectProperties<Conflict>, effect: EffectBase<EffectName, Conflict>) {
        super(game, source, properties, effect);
        // Override any erroneous match passed through properties
        this.match = () => true;
    }

    getTargets(): Conflict[] {
        return this.game.currentConflict ? [this.game.currentConflict] : [];
    }
}
