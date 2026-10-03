import { EffectValue } from './EffectValue.js';
import type { EffectBase } from './EffectBase.js';
import type { CardEffect } from './types.js';

export class SuppressEffect extends EffectValue<CardEffect[]> {
    constructor(private predicate: (effect: EffectBase) => boolean) {
        super([]);
    }

    recalculate() {
        if(typeof this.predicate !== 'function') {
            return false;
        }
        const oldValue = this.value;
        const suppressedEffects = this.requireContext().game.effectEngine.effects.filter((effect) =>
            this.predicate(effect.effect)
        );
        const newValue: CardEffect[] = suppressedEffects.map((effect) => effect.effect);
        this.setValue(newValue);
        return oldValue.length !== newValue.length || oldValue.some((element) => !newValue.includes(element));
    }
}
