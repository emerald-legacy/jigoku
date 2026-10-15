import { ActiveEffect, type EffectMatchFn } from './ActiveEffect.js';
import type Ring from '../Ring.js';

export class RingEffect extends ActiveEffect<Ring> {
    getTargets(matchFn: EffectMatchFn<Ring>): Ring[] {
        return Object.values(this.game.rings).filter((ring: Ring) => matchFn(ring, this.context));
    }
}
