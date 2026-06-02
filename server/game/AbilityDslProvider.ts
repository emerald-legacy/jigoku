// Lazy provider for the AbilityDsl singleton, set once during startup by
// abilitydsl.ts. EffectSource needs the DSL at runtime (applyDurationEffect)
// but CANNOT import abilitydsl directly: that reintroduces a value cycle
//   EffectSource -> abilitydsl -> Costs -> GameActions -> PlaceFateAction -> Ring -> EffectSource
// (Ring extends EffectSource). Measured with `madge --circular` 2026-06-02.
// Do not replace getAbilityDsl() with a direct import — it reintroduces the cycle.
export type AbilityDslType = typeof import('./abilitydsl.js').default;

let dsl: AbilityDslType | undefined;

export function setAbilityDsl(value: AbilityDslType): void {
    dsl = value;
}

export function getAbilityDsl(): AbilityDslType {
    if(!dsl) {
        throw new Error('AbilityDsl accessed before initialisation');
    }
    return dsl;
}
