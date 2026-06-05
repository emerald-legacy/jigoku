export type EventHandler = (...args: unknown[]) => void;

export class GameEventBus {
    private handlers = new Map<string, Set<EventHandler>>();
    private onceWrappers = new Map<string, Map<EventHandler, EventHandler>>();

    on(eventName: string, handler: EventHandler): void {
        let bucket = this.handlers.get(eventName);
        if(!bucket) {
            bucket = new Set();
            this.handlers.set(eventName, bucket);
        }
        bucket.add(handler);
    }

    off(eventName: string, handler: EventHandler): void {
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

    once(eventName: string, handler: EventHandler): void {
        const wrapper: EventHandler = (...args) => {
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

    emit(eventName: string, ...args: unknown[]): void {
        const bucket = this.handlers.get(eventName);
        if(!bucket) {
            return;
        }
        for(const handler of [...bucket]) {
            handler(...args);
        }
    }

    removeAllListeners(eventName?: string): void {
        if(eventName === undefined) {
            this.handlers.clear();
            this.onceWrappers.clear();
            return;
        }
        this.handlers.delete(eventName);
        this.onceWrappers.delete(eventName);
    }
}
