import { AbilityContext, type AbilityContextProperties } from './AbilityContext.js';
import type { Event } from './Events/Event.js';

interface TriggeredAbilityContextProperties extends AbilityContextProperties {
    event: Event;
}

export class TriggeredAbilityContext<S = any> extends AbilityContext<S> {
    event: Event;

    constructor(properties: TriggeredAbilityContextProperties) {
        super(properties);
        this.event = properties.event;
    }

    createCopy(newProps: Partial<TriggeredAbilityContextProperties>): TriggeredAbilityContext<this> {
        return new TriggeredAbilityContext<this>(Object.assign(this.getProps(), newProps));
    }

    getProps(): TriggeredAbilityContextProperties {
        return Object.assign(super.getProps(), { event: this.event });
    }

    cancel() {
        this.event.cancel();
    }
}
