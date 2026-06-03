import type { GameAction } from './GameAction.js';

/**
 * Factory type for catalog lookups. The args are `never[]` rather than `any[]`: the catalog is
 * keyed by a runtime string, so the exact per-factory argument types can't be recovered at the
 * lookup site — `never[]` makes that explicit (callers can't pass arbitrary unchecked args, only
 * call with no args), instead of `any[]` which silently accepted anything. Code that knows a
 * factory's real signature should import it from GameActions directly rather than via the catalog.
 */
export type GameActionFactory = (...args: never[]) => GameAction;

const catalog = new Map<string, GameActionFactory>();

export function setGameActionCatalog(actions: Record<string, unknown>): void {
    for(const [name, factory] of Object.entries(actions)) {
        if(typeof factory === 'function') {
            catalog.set(name, factory as GameActionFactory);
        }
    }
}

export function getGameAction(name: string): GameActionFactory | undefined {
    return catalog.get(name);
}
