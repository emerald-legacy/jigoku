import Effect, { type EffectMatchFn } from './Effect.js';
import type Ring from '../Ring.js';

export default class RingEffect extends Effect<Ring> {
    getTargets(matchFn: EffectMatchFn<Ring>): Ring[] {
        return Object.values(this.game.rings).filter((ring: Ring) => matchFn(ring, this.context));
    }
}
