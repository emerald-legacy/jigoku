/** Calls a method by name, so a spec can drive a private method; throws if the name isn't a method. */
export function callMethod(target: object, method: string, ...args: unknown[]): unknown {
    const fn: unknown = Reflect.get(target, method);
    if(typeof fn !== 'function') {
        throw new Error(`${method} is not a method`);
    }
    return Reflect.apply(fn, target, args);
}
