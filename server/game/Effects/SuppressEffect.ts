import { EffectValue } from './EffectValue.js';
import type StaticEffect from './StaticEffect.js';

export class SuppressEffect extends EffectValue<StaticEffect[]> {
    constructor(private predicate: (effect: unknown) => boolean) {
        super([]);
    }

    recalculate() {
        if(typeof this.predicate !== 'function') {
            return false;
        }
        const oldValue = this.value;
        const suppressedEffects = this.context.game.effectEngine.effects.filter((effect) =>
            this.predicate(effect.effect)
        );
        const newValue = suppressedEffects.map((effect) => effect.effect);
        this.setValue(newValue);
        return oldValue.length !== newValue.length || oldValue.some((element) => !newValue.includes(element));
    }
}
