export type Derivable<T, C> = T | ((context: C) => T);

export function randomItem<T>(array: T[]): T {
    const j = Math.floor(Math.random() * array.length);
    return array[j];
}

export function derive<T, C>(input: Derivable<T, C>, context: C): T {
    return typeof input === 'function' ? (input as (c: C) => T)(context) : input;
}
