import { EventName } from '../Constants.js';
export type Derivable<Value, Context> = Value | ((context: Context) => Value);

/** Values that can't be mistaken for their own factory. */
type Derived = string | number | boolean | null | undefined | readonly unknown[];

export function derive<Value extends Derived, Context>(input: Derivable<Value, Context>, context: Context): Value {
    return typeof input === 'function' ? input(context) : input;
}

/** Whether `key` is one of the object's own keys, not an inherited one such as `toString`. */
export function isOwnKey<Container extends object>(object: Container, key: PropertyKey): key is keyof Container {
    return Object.hasOwn(object, key);
}

export function isEnumValue<EnumType extends Record<string, string>>(enumObject: EnumType, value: string): value is EnumType[keyof EnumType] {
    return Object.values(enumObject).includes(value);
}

/** The game event names `record` has keys for (a `when` or `until`), typed. */
export function eventNamesIn(record: object): EventName[] {
    return Object.values(EventName).filter((name) => name in record);
}
