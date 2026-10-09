import { Event } from './Events/Event.js';
import type { EventParams, EventPayload, GameEvent } from './Events/EventPayloads.js';
import { EventWindow } from './Events/EventWindow.js';
import { ThenEventWindow } from './Events/ThenEventWindow.js';
import type { AbilityType, EventName } from './Constants.js';
import { GameEventBus } from './GameEventBus.js';
import type Game from './Game.js';
import type { ChoiceWindow } from './TriggeredAbility.js';

const windowKey = (eventName: EventName, abilityType: AbilityType) => `${eventName}:${abilityType}`;

/**
 * Raises game events and tells listeners about them: about a game event once it happened (`on`), and about
 * each trigger window (`onTriggerWindow`, per event; `onAggregateWindow`, all of a window's events together).
 */
export class GameEventManager {
    private gameEvents = new GameEventBus<[event: Event]>();
    private triggerWindows = new GameEventBus<[event: Event, window?: ChoiceWindow]>();
    private aggregateWindows = new GameEventBus<[events: Event[], window: ChoiceWindow]>();

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
        this.emit(this.getEvent(eventName, params));
    }

    /** Tells the listeners to a game event that it happened. */
    emit(event: Event): void {
        this.gameEvents.emit(event.name, event);
    }

    on<N extends EventName>(eventName: N, handler: (event: GameEvent<N>) => void): void {
        this.gameEvents.on(eventName, handler);
    }

    once<N extends EventName>(eventName: N, handler: (event: GameEvent<N>) => void): void {
        this.gameEvents.once(eventName, handler);
    }

    off<N extends EventName>(eventName: N, handler: (event: GameEvent<N>) => void): void {
        this.gameEvents.off(eventName, handler);
    }

    /** Called for each event of an `abilityType` trigger window, with the window to offer abilities to (none for other effects). */
    onTriggerWindow<N extends EventName>(eventName: N, abilityType: AbilityType, handler: (event: GameEvent<N>, window?: ChoiceWindow) => void): void {
        this.triggerWindows.on(windowKey(eventName, abilityType), handler);
    }

    onceTriggerWindow<N extends EventName>(eventName: N, abilityType: AbilityType, handler: (event: GameEvent<N>, window?: ChoiceWindow) => void): void {
        this.triggerWindows.once(windowKey(eventName, abilityType), handler);
    }

    offTriggerWindow<N extends EventName>(eventName: N, abilityType: AbilityType, handler: (event: GameEvent<N>, window?: ChoiceWindow) => void): void {
        this.triggerWindows.off(windowKey(eventName, abilityType), handler);
    }

    emitTriggerWindow(event: Event, abilityType: AbilityType, window?: ChoiceWindow): void {
        this.triggerWindows.emit(windowKey(event.name, abilityType), event, window);
    }

    /** Called once per `abilityType` trigger window, with all of its events. */
    onAggregateWindow(abilityType: AbilityType, handler: (events: Event[], window: ChoiceWindow) => void): void {
        this.aggregateWindows.on(abilityType, handler);
    }

    offAggregateWindow(abilityType: AbilityType, handler: (events: Event[], window: ChoiceWindow) => void): void {
        this.aggregateWindows.off(abilityType, handler);
    }

    emitAggregateWindow(events: Event[], abilityType: AbilityType, window: ChoiceWindow): void {
        this.aggregateWindows.emit(abilityType, events, window);
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
}
