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
