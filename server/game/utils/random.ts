import { randomInt } from 'crypto';

/** One item, each equally likely; `undefined` for an empty array. */
export function randomItem<T>(array: readonly T[]): T | undefined {
    return array.length > 0 ? array[randomInt(0, array.length)] : undefined;
}

/** A shuffled copy (Fisher-Yates). */
export function shuffle<T>(array: readonly T[]): T[] {
    const result = array.slice();
    for(let i = result.length - 1; i > 0; i--) {
        const j = randomInt(0, i + 1);
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/** A roll of a die with `sides` sides: 1 to `sides`. */
export function rollDie(sides: number): number {
    return randomInt(1, sides + 1);
}
