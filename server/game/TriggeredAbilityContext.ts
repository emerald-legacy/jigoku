import { AbilityContext, type AbilityContextProperties } from './AbilityContext.js';
import type BaseCard from './BaseCard.js';
import type { Event } from './Events/Event.js';
import type { EventUnion } from './Events/EventPayloads.js';
import type TriggeredAbility from './TriggeredAbility.js';

// An event whose specific name is not statically known here: the framework Event
// surface plus every payload field as optional. (Precise per-event typing is
// GameEvent<N>, produced by the typed event factory at known-name call sites.)
export type AnyEvent = Event & Omit<EventUnion, 'context' | 'name' | 'cancelled' | 'resolved'>;

interface TriggeredAbilityContextProperties extends AbilityContextProperties {
    ability: TriggeredAbility;
    event: AnyEvent;
}

export class TriggeredAbilityContext<S = BaseCard, T extends BaseCard = BaseCard> extends AbilityContext<S, T> {
    declare ability: TriggeredAbility;
    event: AnyEvent;

    constructor(properties: TriggeredAbilityContextProperties) {
        super(properties);
        this.ability = properties.ability;
        this.event = properties.event;
    }

    createCopy(newProps: Partial<TriggeredAbilityContextProperties>): this {
        return new TriggeredAbilityContext<S, T>(Object.assign(this.getProps(), newProps)) as this;
    }

    getProps(): TriggeredAbilityContextProperties {
        return Object.assign(super.getProps(), { ability: this.ability, event: this.event });
    }

    cancel() {
        this.event.cancel();
    }
}
