import type { OwnContextCallback } from './Interfaces.js';

/** A listener; method syntax, so one taking a narrower argument (a game event's typed payload) fits. */
export type EventHandler<A extends unknown[] = unknown[]> = OwnContextCallback<A, void>;

/** Listeners by key, each called with the arguments `A` of its bus. */
export class GameEventBus<A extends unknown[] = unknown[]> {
    private handlers = new Map<string, Set<EventHandler<A>>>();
    private onceWrappers = new Map<string, Map<EventHandler<A>, EventHandler<A>>>();

    on(eventName: string, handler: EventHandler<A>): void {
        let bucket = this.handlers.get(eventName);
        if(!bucket) {
            bucket = new Set();
            this.handlers.set(eventName, bucket);
        }
        bucket.add(handler);
    }

    off(eventName: string, handler: EventHandler<A>): void {
        // A `once` registration stores its wrapper keyed by the caller's original
        // handler, so off(name, originalHandler) can cancel a still-pending once.
        const onceForEvent = this.onceWrappers.get(eventName);
        const wrapper = onceForEvent && onceForEvent.get(handler);
        if(onceForEvent && wrapper) {
            onceForEvent.delete(handler);
            if(onceForEvent.size === 0) {
                this.onceWrappers.delete(eventName);
            }
        }
        const bucket = this.handlers.get(eventName);
        if(!bucket) {
            return;
        }
        bucket.delete(wrapper ?? handler);
        if(bucket.size === 0) {
            this.handlers.delete(eventName);
        }
    }

    once(eventName: string, handler: EventHandler<A>): void {
        const wrapper: EventHandler<A> = (...args) => {
            this.off(eventName, handler);
            handler(...args);
        };
        let onceForEvent = this.onceWrappers.get(eventName);
        if(!onceForEvent) {
            onceForEvent = new Map();
            this.onceWrappers.set(eventName, onceForEvent);
        }
        onceForEvent.set(handler, wrapper);
        this.on(eventName, wrapper);
    }

    emit(eventName: string, ...args: A): void {
        const bucket = this.handlers.get(eventName);
        if(!bucket) {
            return;
        }
        for(const handler of [...bucket]) {
            handler(...args);
        }
    }

}
