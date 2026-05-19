import { randomInt } from 'crypto';

export function shuffle<T>(arr: T[]): T[] {
    const result = arr.slice();
    for(let i = result.length - 1; i > 0; i--) {
        const j = randomInt(0, i + 1);
        const temp = result[i];
        result[i] = result[j];
        result[j] = temp;
    }
    return result;
}
