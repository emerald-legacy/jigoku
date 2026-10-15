import type { EffectName } from '../Constants.js';
import type { GameObject } from '../GameObject.js';
import type { EffectApplier } from './EffectApplier.js';

/** An effect's name decides its value type (`EffectBuilder` enforces this), so checking the name narrows the value. */
export function isEffectOf<N extends EffectName, T extends GameObject>(effect: EffectApplier<EffectName, T, unknown>, type: N): effect is EffectApplier<N, T> {
    return effect.type === type;
}

export function isEffectOfAny<N extends EffectName, T extends GameObject>(effect: EffectApplier<EffectName, T, unknown>, types: readonly N[]): effect is EffectApplier<N, T> {
    return types.some((name) => name === effect.type);
}
