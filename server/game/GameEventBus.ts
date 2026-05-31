export type EventHandler = (...args: unknown[]) => void;

export class GameEventBus {
    private handlers = new Map<string, Set<EventHandler>>();

    on(eventName: string, handler: EventHandler): void {
        let bucket = this.handlers.get(eventName);
        if(!bucket) {
            bucket = new Set();
            this.handlers.set(eventName, bucket);
        }
        bucket.add(handler);
    }

    off(eventName: string, handler: EventHandler): void {
        const bucket = this.handlers.get(eventName);
        if(!bucket) {
            return;
        }
        bucket.delete(handler);
        if(bucket.size === 0) {
            this.handlers.delete(eventName);
        }
    }

    once(eventName: string, handler: EventHandler): void {
        const wrapper: EventHandler = (...args) => {
            this.off(eventName, wrapper);
            handler(...args);
        };
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
            return;
        }
        this.handlers.delete(eventName);
    }
}
