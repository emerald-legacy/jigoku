import Effect, { type EffectProperties } from './Effect.js';
import type { EffectName } from '../Constants.js';
import { Duel } from '../Duel.js';
import type EffectSource from '../EffectSource.js';
import type Game from '../Game.js';
import type { EffectBase } from './EffectBase.js';

export default class DuelEffect extends Effect<Duel> {
    duel: Duel | undefined;

    constructor(game: Game, source: EffectSource, properties: EffectProperties<Duel>, effect: EffectBase<EffectName, Duel>) {
        super(game, source, properties, effect);
        // Override any erroneous match passed through properties
        this.match = () => true;
        // the lasting effect action hands over its targets as a list
        const target = Array.isArray(properties.target) ? properties.target[0] : undefined;
        this.duel = target instanceof Duel ? target : undefined;
    }

    getTargets(): Duel[] {
        return this.duel ? [this.duel] : [];
    }
}
