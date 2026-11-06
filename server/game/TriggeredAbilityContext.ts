import { AbilityContext, type AbilityContextProperties } from './AbilityContext.js';
import type BaseCard from './BaseCard.js';
import type { EffectSource } from './EffectSource.js';
import { Event } from './Events/Event.js';
import type { EventUnion } from './Events/EventPayloads.js';
import type { TriggeredAbility } from './TriggeredAbility.js';

// An event whose specific name is not statically known here: the framework Event
// surface plus every payload field as optional. (Precise per-event typing is
// GameEvent<Name>, produced by the typed event factory at known-name call sites.)
export type AnyEvent = Event & Omit<EventUnion, 'context' | 'name' | 'cancelled' | 'resolved'>;

/**
 * What a trigger fired on: one event, every event of an aggregate trigger, or nothing when a
 * trigger is resolved without its event (Countryside Trader).
 */
export type TriggeringEvent = AnyEvent | Event[] | undefined;

interface TriggeredAbilityContextProperties<Trigger extends TriggeringEvent = AnyEvent> extends AbilityContextProperties {
    ability: TriggeredAbility;
    event: Trigger;
}

export class TriggeredAbilityContext<
    Source extends EffectSource = BaseCard,
    Target extends BaseCard = BaseCard,
    Trigger extends TriggeringEvent = AnyEvent
> extends AbilityContext<Source, Target> {
    declare ability: TriggeredAbility;
    event: Trigger;

    constructor(properties: TriggeredAbilityContextProperties<Trigger>) {
        super(properties);
        this.event = properties.event;
    }

    override copy(newProps: Partial<TriggeredAbilityContextProperties<Trigger>>): TriggeredAbilityContext<Source, Target, Trigger> {
        return this.copyStateTo(this.createCopy(newProps));
    }

    override createCopy(newProps: Partial<TriggeredAbilityContextProperties<Trigger>>): TriggeredAbilityContext<Source, Target, Trigger> {
        return new TriggeredAbilityContext<Source, Target, Trigger>(Object.assign(this.getProps(), newProps));
    }

    override getProps(): TriggeredAbilityContextProperties<Trigger> {
        return Object.assign(super.getProps(), { ability: this.ability, event: this.event });
    }

    cancel() {
        // an aggregate or event-less trigger has no single event to cancel
        if(this.event instanceof Event) {
            this.event.cancel();
        }
    }
}
