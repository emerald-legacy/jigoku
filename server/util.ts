export function detectBinary(
    state: unknown,
    path = '',
    results: Array<{ path: string; type: string }> = []
): Array<{ path: string; type: string }> {
    if(!state) {
        return results;
    }

    const type = state.constructor.name;
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

    if(type === 'Object' && typeof state === 'object') {
        for(const [key, value] of Object.entries(state)) {
            detectBinary(value, `${path}.${key}`, results);
        }
    } else if(type === 'Array' && Array.isArray(state)) {
        state.forEach((value: unknown, i) => detectBinary(value, `${path}[${i}]`, results));
    }

    return results;
}
