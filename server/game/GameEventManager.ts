import { Event } from './Events/Event.js';
import type { EventPayload, GameEvent } from './Events/EventPayloads.js';
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

    getEvent<N extends EventName>(eventName: N, params?: EventPayload<N>, handler?: (event: GameEvent<N>) => void): GameEvent<N>;
    getEvent(eventName: string, params?: Record<string, unknown>, handler?: (event: Event) => void): Event;
    getEvent(eventName: string, params: Record<string, unknown> = {}, handler?: (event: Event) => void): Event {
        return new Event(eventName, params, handler);
    }

    raiseEvent<N extends EventName>(eventName: N, params?: EventPayload<N>, handler?: (event: GameEvent<N>) => void): GameEvent<N>;
    raiseEvent(eventName: string, params?: Record<string, unknown>, handler?: (event: Event) => void): Event;
    raiseEvent(eventName: string, params: Record<string, unknown> = {}, handler: (event: Event) => void = () => true): Event {
        const event = this.getEvent(eventName, params, handler);
        this.openEventWindow([event]);
        return event;
    }

    emitEvent(eventName: string, params: Record<string, unknown> = {}): void {
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
