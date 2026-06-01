import type { GameAction } from './GameAction.js';

export type GameActionFactory = (...args: any[]) => GameAction;

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
