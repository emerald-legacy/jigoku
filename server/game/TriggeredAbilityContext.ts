import { AbilityContext, type AbilityContextProperties } from './AbilityContext.js';
import type BaseCard from './BaseCard.js';
import type { EffectSource } from './EffectSource.js';
import { Event } from './Events/Event.js';
import type { EventUnion } from './Events/EventPayloads.js';
import type { TriggeredAbility } from './TriggeredAbility.js';

// An event whose specific name is not statically known here: the framework Event
// surface plus every payload field as optional. (Precise per-event typing is
// GameEvent<N>, produced by the typed event factory at known-name call sites.)
export type AnyEvent = Event & Omit<EventUnion, 'context' | 'name' | 'cancelled' | 'resolved'>;

/**
 * What a trigger fired on: one event, every event of an aggregate trigger, or nothing when a
 * trigger is resolved without its event (Countryside Trader).
 */
export type TriggeringEvent = AnyEvent | Event[] | undefined;

interface TriggeredAbilityContextProperties<E extends TriggeringEvent = AnyEvent> extends AbilityContextProperties {
    ability: TriggeredAbility;
    event: E;
}

export class TriggeredAbilityContext<
    S extends EffectSource = BaseCard,
    T extends BaseCard = BaseCard,
    E extends TriggeringEvent = AnyEvent
> extends AbilityContext<S, T> {
    declare ability: TriggeredAbility;
    event: E;

    constructor(properties: TriggeredAbilityContextProperties<E>) {
        super(properties);
        this.event = properties.event;
    }

    copy(newProps: Partial<TriggeredAbilityContextProperties<E>>): TriggeredAbilityContext<S, T, E> {
        return this.copyStateTo(this.createCopy(newProps));
    }

    createCopy(newProps: Partial<TriggeredAbilityContextProperties<E>>): TriggeredAbilityContext<S, T, E> {
        return new TriggeredAbilityContext<S, T, E>(Object.assign(this.getProps(), newProps));
    }

    getProps(): TriggeredAbilityContextProperties<E> {
        return Object.assign(super.getProps(), { ability: this.ability, event: this.event });
    }

    cancel() {
        // an aggregate or event-less trigger has no single event to cancel
        if(this.event instanceof Event) {
            this.event.cancel();
        }
    }
}
