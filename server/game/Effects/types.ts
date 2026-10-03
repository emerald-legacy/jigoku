import type { AbilityContext } from '../AbilityContext.js';
import type { EffectName, Duration } from '../Constants.js';
import type { GameObject } from '../GameObject.js';
import type { EffectBase } from './EffectBase.js';
import type { EffectValueMap } from './EffectValueMap.js';

export interface CardEffect<N extends EffectName = EffectName> {
    type: N;
    value: unknown;
    context: AbilityContext;
    duration?: Duration | null;
    isConditional?: boolean;
    getValue(target: GameObject): EffectValueMap[N];
    /** Without a target a dynamic effect has no value. */
    getValue(): EffectValueMap[N] | undefined;
}

/** An effect's name decides its value type (`EffectBuilder` enforces this), so checking the name narrows the value. */
export function isEffectOf<N extends EffectName, T extends GameObject>(effect: EffectBase<EffectName, T>, type: N): effect is EffectBase<N, T>;
export function isEffectOf<N extends EffectName>(effect: CardEffect, type: N): effect is CardEffect<N>;
export function isEffectOf(effect: CardEffect, type: EffectName): boolean {
    return effect.type === type;
}

export function isEffectOfAny<N extends EffectName, T extends GameObject>(effect: EffectBase<EffectName, T>, types: readonly N[]): effect is EffectBase<N, T>;
export function isEffectOfAny<N extends EffectName>(effect: CardEffect, types: readonly N[]): effect is CardEffect<N>;
export function isEffectOfAny(effect: CardEffect, types: readonly EffectName[]): boolean {
    return types.includes(effect.type);
}
