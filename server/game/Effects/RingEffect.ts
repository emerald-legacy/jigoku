import Effect, { type EffectMatchFn } from './Effect.js';
import type { GameObject } from '../GameObject.js';
import type Ring from '../Ring.js';

export default class RingEffect extends Effect {
    getTargets(): GameObject[] {
        const matchFn = this.match as EffectMatchFn;
        return Object.values(this.game.rings).filter((ring: Ring) => matchFn(ring, this.context));
    }
}
