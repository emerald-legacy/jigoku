import { Event } from './Events/Event.js';
import type { EventParams, EventPayload, GameEvent } from './Events/EventPayloads.js';
import InitiateCardAbilityEvent from './Events/InitiateCardAbilityEvent.js';
import EventWindow from './Events/EventWindow.js';
import ThenEventWindow from './Events/ThenEventWindow.js';
import InitiateAbilityEventWindow from './Events/InitiateAbilityEventWindow.js';
import { EventName } from './Constants.js';
import { GameEventBus, type EventHandler } from './GameEventBus.js';
import type Game from './Game.js';

export class GameEventManager {
    private bus = new GameEventBus();

    constructor(private readonly game: Game) {}

    getEvent<N extends EventName>(eventName: N, params?: EventParams<N>, handler?: (event: GameEvent<N>) => void): GameEvent<N> {
        const payload: EventPayload<N> | undefined = params;
        const event = Object.assign(new Event(eventName, {}), payload);
        if(handler) {
            event.replaceHandler(() => handler(event));
        }
        return event;
    }

    raiseEvent<N extends EventName>(eventName: N, params?: EventParams<N>, handler: (event: GameEvent<N>) => void = () => true): GameEvent<N> {
        const event = this.getEvent(eventName, params, handler);
        this.openEventWindow([event]);
        return event;
    }

    emitEvent<N extends EventName>(eventName: N, params?: EventParams<N>): void {
        const event = this.getEvent(eventName, params);
        this.emit(event.name, event);
    }

    emit(eventName: string, ...args: unknown[]): void {
        this.bus.emit(eventName, ...args);
    }

    on(eventName: string, handler: EventHandler): void {
        this.bus.on(eventName, handler);
    }

    once(eventName: string, handler: EventHandler): void {
        this.bus.once(eventName, handler);
    }

    removeListener(eventName: string, handler: EventHandler): void {
        this.bus.off(eventName, handler);
    }

    openEventWindow(events: Event | Event[]): EventWindow {
        if(!Array.isArray(events)) {
            events = [events];
        }
        return this.game.queueStep(new EventWindow(this.game, events));
    }

    openThenEventWindow(events: Event | Event[]): EventWindow | ThenEventWindow {
        if(this.game.currentEventWindow) {
            if(!Array.isArray(events)) {
                events = [events];
            }
            return this.game.queueStep(new ThenEventWindow(this.game, events));
        }
        return this.openEventWindow(events);
    }

    raiseInitiateAbilityEvent(params: Record<string, unknown>, handler: () => void): void {
        this.raiseMultipleInitiateAbilityEvents([{ params: params, handler: handler }]);
    }

    raiseMultipleInitiateAbilityEvents(eventProps: Array<{ params: Record<string, unknown>; handler: () => void }>): void {
        const events = eventProps.map((event) => new InitiateCardAbilityEvent(event.params, event.handler));
        this.game.queueStep(new InitiateAbilityEventWindow(this.game, events));
    }
}
