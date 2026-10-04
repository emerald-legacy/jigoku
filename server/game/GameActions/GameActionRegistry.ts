import type { GameAction } from './GameAction.js';
import type * as GameActions from './GameActions.js';

/** Looked up by a runtime name, so the argument types are unknown: callable with no args only. */
export type GameActionFactory = (...args: never[]) => GameAction;

/** The names `allowGameAction` accepts: `GameActions` exports only factories. Keys only, so no factory type is resolved. */
export type GameActionName = keyof typeof GameActions;

const catalog = new Map<string, GameActionFactory>();

/** Any value but a function or an object: a catalog skips these. */
type NotAFactory = string | number | boolean | bigint | symbol | null | undefined;

export function setGameActionCatalog(actions: Record<string, GameActionFactory | NotAFactory>): void {
    for(const [name, factory] of Object.entries(actions)) {
        if(typeof factory === 'function') {
            catalog.set(name, factory);
        }
    }
}

export function getGameAction(name: string): GameActionFactory | undefined {
    return catalog.get(name);
}
