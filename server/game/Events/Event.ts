import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { EventName } from '../Constants.js';
import type EventWindow from './EventWindow.js';

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

    private static readonly RESERVED_PARAM_KEYS = new Set(['cancelled', 'resolved', 'handler', 'window']);

    constructor(
        public name: string,
        params: Record<string, unknown>,
        private handler?: (event: Event) => void
    ) {
        for(const key in params) {
            if(Object.prototype.hasOwnProperty.call(params, key) && !Event.RESERVED_PARAM_KEYS.has(key)) {
                (this as Record<string, unknown>)[key] = params[key];
            }
        }
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

    unsetWindow() {
        this.window = null;
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
