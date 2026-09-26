export type Derivable<T, C> = T | ((context: C) => T);

export function randomItem<T>(array: T[]): T {
    const j = Math.floor(Math.random() * array.length);
    return array[j];
}

/** Values that can't be mistaken for their own factory. */
type Derived = string | number | boolean | null | undefined | readonly unknown[];

export function derive<T extends Derived, C>(input: Derivable<T, C>, context: C): T {
    return typeof input === 'function' ? input(context) : input;
}

/** Whether `key` is one of the object's own keys, not an inherited one such as `toString`. */
export function isOwnKey<T extends object>(object: T, key: PropertyKey): key is keyof T {
    return Object.hasOwn(object, key);
}

/** Whether a string is one of a string enum's values, such as a `Location` read from a pile key. */
export function isEnumValue<E extends Record<string, string>>(enumObject: E, value: string): value is E[keyof E] {
    return Object.values(enumObject).includes(value);
}
