export function detectBinary(
    state: unknown,
    path = '',
    results: Array<{ path: string; type: string }> = []
): Array<{ path: string; type: string }> {
    if(!state) {
        return results;
    }

    const type = (state as { constructor: { name: string } }).constructor.name;
    if(
        type !== 'Array' &&
        type !== 'Boolean' &&
        type !== 'Date' &&
        type !== 'Number' &&
        type !== 'Object' &&
        type !== 'String'
    ) {
        results.push({ path: path, type });
    }

    if(type === 'Object') {
        const obj = state as Record<string, unknown>;
        for(let key in obj) {
            detectBinary(obj[key], `${path}.${key}`, results);
        }
    } else if(type === 'Array') {
        const arr = state as unknown[];
        for(let i = 0; i < arr.length; ++i) {
            detectBinary(arr[i], `${path}[${i}]`, results);
        }
    }

    return results;
}
