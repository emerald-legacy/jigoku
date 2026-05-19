import Effect from './Effect.js';

export default class RingEffect extends Effect {
    getTargets(): any[] {
        return Object.values(this.game.rings).filter((ring: any) => this.match(ring, this.context));
    }
}
