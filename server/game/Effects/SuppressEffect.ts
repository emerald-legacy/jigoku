import { EffectValue } from './EffectValue.js';
import type { EffectApplier } from './EffectApplier.js';
import type { EffectName } from '../Constants.js';
import type { EffectValueMap } from './EffectValueMap.js';

export class SuppressEffect extends EffectValue<EffectValueMap[EffectName.SuppressEffects]> {
    constructor(private predicate: (effect: EffectApplier) => boolean) {
        super([]);
    }

    recalculate() {
        const oldValue = this.value;
        const suppressedEffects = this.requireContext().game.effectEngine.effects.filter((effect) =>
            this.predicate(effect.effect)
        );
        const newValue: EffectValueMap[EffectName.SuppressEffects] = suppressedEffects.map((effect) => effect.effect);
        this.setValue(newValue);
        return oldValue.length !== newValue.length || oldValue.some((element) => !newValue.includes(element));
    }
}
