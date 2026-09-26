export type Derivable<T, C> = T | ((context: C) => T);

export function randomItem<T>(array: T[]): T {
    const j = Math.floor(Math.random() * array.length);
    return array[j];
}

export function derive<T, C>(input: Derivable<T, C>, context: C): T {
    return typeof input === 'function' ? (input as (c: C) => T)(context) : input;
}

/** Whether a string is one of a string enum's values, such as a `Location` read from a pile key. */
export function isEnumValue<E extends Record<string, string>>(enumObject: E, value: string): value is E[keyof E] {
    return Object.values(enumObject).includes(value);
}
