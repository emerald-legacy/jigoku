import type Game from './Game.js';
import type { AbilityType, EventName } from './Constants.js';
import type { GameEvent } from './Events/EventPayloads.js';
import type { OwnContextCallback } from './Interfaces.js';
import { eventNamesIn } from './utils/helpers.js';

/** Handlers by game event, each getting its event typed; method syntax, so a narrower parameter fits. */
export type EventHandlers = { [N in EventName]?: OwnContextCallback<[event: GameEvent<N>], void> };

/** A card's listeners to game events and trigger windows, until `unregisterAll`. */
export class EventRegistrar {
    #unsubscribers: (() => void)[] = [];

    constructor(private readonly game: Game) {}

    /** Listens to each game event in `handlers`, once it happened. */
    register(handlers: EventHandlers): void {
        for(const eventName of eventNamesIn(handlers)) {
            this.#on(eventName, handlers[eventName]);
        }
    }

    /** Listens to an event in each `abilityType` trigger window, before its abilities are offered. */
    registerTriggerWindow<N extends EventName>(eventName: N, abilityType: AbilityType, handler: (event: GameEvent<N>) => void): void {
        this.game.onTriggerWindow(eventName, abilityType, handler);
        this.#unsubscribers.push(() => this.game.offTriggerWindow(eventName, abilityType, handler));
    }

    unregisterAll(): void {
        this.#unsubscribers.forEach((unsubscribe) => unsubscribe());
        this.#unsubscribers = [];
    }

    #on<N extends EventName>(eventName: N, handler: EventHandlers[N]): void {
        if(!handler) {
            return;
        }
        this.game.on(eventName, handler);
        this.#unsubscribers.push(() => this.game.off(eventName, handler));
    }
}
