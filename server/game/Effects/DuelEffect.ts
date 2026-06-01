import Effect, { type EffectProperties } from './Effect.js';
import type EffectSource from '../EffectSource.js';
import type { Duel } from '../Duel.js';
import type Game from '../Game.js';
import type { GameObject } from '../GameObject.js';
import type StaticEffect from './StaticEffect.js';

export default class DuelEffect extends Effect {
    duel: Duel | undefined;

    constructor(game: Game, source: EffectSource, properties: EffectProperties, effect: StaticEffect) {
        super(game, source, properties, effect);
        // Override any erroneous match passed through properties
        this.match = () => true;
        this.duel = (properties.target as Duel[])[0];
    }

    getTargets(): GameObject[] {
        return this.duel ? [this.duel] : [];
    }
}
