import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import { EventName } from '../Constants.js';
import type EventWindow from './EventWindow.js';
import type { GameEvent } from './EventPayloads.js';

export class Event {
    cancelled = false;
    resolved = false;
    context: AbilityContext | null = null;
    window: EventWindow | null = null;
    replacementEvent: Event | null = null;
    condition = (_event: Event) => true;
    order = 0;
    isContingent = false;
    checkFullyResolved = (event: Event) => !event.cancelled;
    createContingentEvents = (): Event[] => [];
    preResolutionEffect: () => void = () => true;
    onPlayCardSource?: BaseCard;
    card?: BaseCard;
    tokenCharacter?: DrawCard;

    private static readonly RESERVED_PARAM_KEYS = new Set(['cancelled', 'resolved', 'handler', 'window']);

    constructor(
        public name: string,
        params: Record<string, unknown>,
        private handler?: (event: Event) => void
    ) {
        for(const key in params) {
            if(Object.prototype.hasOwnProperty.call(params, key) && !Event.RESERVED_PARAM_KEYS.has(key)) {
                Reflect.set(this, key, params[key]);
            }
        }
    }

    /**
     * The card this event should be presented as affecting when a player is asked
     * which of several simultaneous events to respond to. A createToken event's
     * `card` is the facedown province card, which is removed from the game before
     * the reaction window opens - the token that entered play is the one the player
     * can actually see and click.
     */
    getPromptCard(): BaseCard | undefined {
        return this.tokenCharacter ?? this.card;
    }

    /**
     * `getPromptCard` for a context's event, which is an array of events for an
     * `aggregateWhen` ability - those name no single card.
     */
    static promptCardOf(event: unknown): BaseCard | undefined {
        return event instanceof Event ? event.getPromptCard() : undefined;
    }

    /** The payload of an event follows from its name. */
    is<N extends EventName>(name: N): this is GameEvent<N> {
        return this.name === name;
    }

    cancel() {
        this.cancelled = true;
        if(this.window) {
            this.window.removeEvent(this);
        }
    }

    setWindow(window: EventWindow) {
        this.window = window;
    }

    checkCondition() {
        if(this.cancelled || this.resolved || this.name === EventName.Unnamed) {
            return;
        }
        if(!this.condition(this)) {
            this.cancel();
        }
    }

    getResolutionEvent(): Event {
        if(this.replacementEvent) {
            return this.replacementEvent.getResolutionEvent();
        }
        return this;
    }

    isFullyResolved() {
        return this.checkFullyResolved(this.getResolutionEvent());
    }

    hasHandler(): boolean {
        return Boolean(this.handler);
    }

    executeHandler() {
        this.resolved = true;
        if(this.handler) {
            this.handler(this);
        }
    }

    replaceHandler(newHandler: (event: Event) => void) {
        this.handler = newHandler;
    }
}
