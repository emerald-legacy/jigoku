import type { EffectName } from '../Constants.js';
import type { GameObject } from '../GameObject.js';
import type { EffectApplier } from './EffectApplier.js';

/** An effect's name decides its value type (`EffectBuilder` enforces this), so checking the name narrows the value. */
export function isEffectOf<EffectType extends EffectName, Target extends GameObject>(effect: EffectApplier<EffectName, Target, unknown>, type: EffectType): effect is EffectApplier<EffectType, Target> {
    return effect.type === type;
}

export function isEffectOfAny<EffectType extends EffectName, Target extends GameObject>(effect: EffectApplier<EffectName, Target, unknown>, types: readonly EffectType[]): effect is EffectApplier<EffectType, Target> {
    return types.some((name) => name === effect.type);
}
