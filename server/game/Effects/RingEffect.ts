import Effect, { type EffectMatchFn } from './Effect.js';

export default class RingEffect extends Effect {
    getTargets(): any[] {
        const matchFn = this.match as EffectMatchFn;
        return Object.values(this.game.rings).filter((ring: any) => matchFn(ring, this.context));
    }
}
