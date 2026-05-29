import { AbilityContext, type AbilityContextProperties } from './AbilityContext.js';
import type BaseCard from './BaseCard.js';
import type { Event } from './Events/Event.js';

interface TriggeredAbilityContextProperties extends AbilityContextProperties {
    event: Event;
}

export class TriggeredAbilityContext<S = any, T extends BaseCard = BaseCard> extends AbilityContext<S, T> {
    event: Event;

    constructor(properties: TriggeredAbilityContextProperties) {
        super(properties);
        this.event = properties.event;
    }

    createCopy(newProps: Partial<TriggeredAbilityContextProperties>): TriggeredAbilityContext<this, T> {
        return new TriggeredAbilityContext<this, T>(Object.assign(this.getProps(), newProps));
    }

    getProps(): TriggeredAbilityContextProperties {
        return Object.assign(super.getProps(), { event: this.event });
    }

    cancel() {
        this.event.cancel();
    }
}
