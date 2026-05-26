import type { AbilityContext } from '../AbilityContext.js';
import { EventNames } from '../Constants.js';

type Params = {
    amount: number;
    context: AbilityContext;
    cannotBeCancelled: boolean;
};

export class Event {
    cancelled = false;
    resolved = false;
    context: AbilityContext | null = null;
    window: any = null;
    replacementEvent: Event | null = null;
    condition = (_event: Event) => true;
    order = 0;
    isContingent = false;
    checkFullyResolved = (event: Event) => !event.cancelled;
    createContingentEvents = (): Event[] => [];
    preResolutionEffect = () => true;
    onPlayCardSource?: any;
    [key: string]: any;

    constructor(
        public name: string,
        params: Partial<Params>,
        private handler?: (event: Event & Partial<Params>) => void
    ) {
        for(const key in params) {
            if(Object.prototype.hasOwnProperty.call(params, key)) {
                this[key] = (params as Record<string, unknown>)[key];
            }
        }
    }

    cancel() {
        this.cancelled = true;
        if(this.window) {
            this.window.removeEvent(this);
        }
    }

    setWindow(window: any) {
        this.window = window;
    }

    unsetWindow() {
        this.window = null;
    }

    checkCondition() {
        if(this.cancelled || this.resolved || this.name === EventNames.Unnamed) {
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

    executeHandler() {
        this.resolved = true;
        if(this.handler) {
            this.handler(this as Event & Partial<Params>);
        }
    }

    replaceHandler(newHandler: (event: Event & Partial<Params>) => void) {
        this.handler = newHandler;
    }
}
