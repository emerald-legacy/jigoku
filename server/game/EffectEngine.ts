import { Duration, EffectName, EventName } from './Constants.js';
import type Effect from './Effects/Effect.js';
import type { EffectUntil } from './Effects/Effect.js';
import { isEffectOf } from './Effects/types.js';
import type { DelayedEffectValue, DelayedEffectWhen } from './Effects/EffectValueMap.js';
import type { AbilityContext } from './AbilityContext.js';
import { isEnumValue } from './utils/helpers.js';
import type EffectSource from './EffectSource.js';
import { Event } from './Events/Event.js';
import type { GameEvent } from './Events/EventPayloads.js';
import { EventRegistrar } from './EventRegistrar.js';
import type Game from './Game.js';

// an event's name decides its payload
function isEventNamed<N extends EventName>(event: Event, name: N): event is GameEvent<N> {
    return event.name === name;
}

function fireTrigger<N extends EventName>(when: DelayedEffectWhen, name: N, event: Event, context: AbilityContext): unknown {
    const trigger = when[name];
    return trigger && isEventNamed(event, name) && trigger(event, context);
}

function untilEnds<N extends EventName>(until: EffectUntil, name: N, event: Event): unknown {
    const ends = until[name];
    return ends && isEventNamed(event, name) && ends(event);
}

interface CustomDurationEvent {
    name: string;
    handler: (...args: unknown[]) => void;
    effect: Effect;
}

export class EffectEngine {
    events: EventRegistrar;
    effects: Array<Effect> = [];
    customDurationEvents: CustomDurationEvent[] = [];
    newEffect = false;

    constructor(private game: Game) {
        this.events = new EventRegistrar(game, this);
        this.events.register([
            EventName.OnConflictFinished,
            EventName.OnPhaseEnded,
            EventName.OnRoundEnded,
            EventName.OnDuelFinished,
            EventName.OnPassActionPhasePriority
        ]);
    }

    add(effect: Effect) {
        this.effects.push(effect);
        if(effect.duration === Duration.Custom) {
            this.registerCustomDurationEvents(effect);
        }
        this.newEffect = true;
        return effect;
    }

    checkDelayedEffects(events: Event[]) {
        let effectsToTrigger: { effect: Effect; properties: DelayedEffectValue }[] = [];
        const effectsToRemove: Effect[] = [];
        for(const effect of this.effects.filter((effect) => effect.isEffectActive())) {
            const delayedEffect = effect.effect;
            // a delayed effect is static, so it has a value without a target
            const properties = isEffectOf(delayedEffect, EffectName.DelayedEffect) ? delayedEffect.getValue() : undefined;
            if(!properties) {
                continue;
            }
            if(properties.condition) {
                if(properties.condition(effect.context)) {
                    effectsToTrigger.push({ effect, properties });
                }
            } else {
                const when = properties.when ?? {};
                const triggeringEvents = events.filter((event) => isEnumValue(EventName, event.name) && when[event.name]);
                if(triggeringEvents.length > 0) {
                    let effectTriggered = false;
                    if(triggeringEvents.some((event) => isEnumValue(EventName, event.name) && fireTrigger(when, event.name, event, effect.context))) {
                        effectsToTrigger.push({ effect, properties });
                        effectTriggered = true;
                    }
                    if(!properties.multipleTrigger && effect.duration !== Duration.Persistent && (!properties.onlyRemoveOnSuccess || effectTriggered)) {
                        effectsToRemove.push(effect);
                    }
                }
            }
        }
        const triggers = effectsToTrigger.map(({ effect, properties }) => {
            const context = effect.context;
            const targets = effect.targets;
            return {
                title: context.source.name + '\'s effect' + (targets.length === 1 ? ' on ' + targets[0].name : ''),
                handler: () => {
                    properties.gameAction.setDefaultTarget(() => targets);
                    if(properties.message && properties.gameAction.hasLegalTarget(context)) {
                        let messageArgs = properties.messageArgs || [];
                        if(typeof messageArgs === 'function') {
                            messageArgs = messageArgs(context, targets);
                        }
                        this.game.addMessage(properties.message, ...(messageArgs));
                    }
                    const actionEvents: Event[] = [];
                    properties.gameAction.addEventsToArray(actionEvents, context);
                    this.game.queueSimpleStep(() => this.game.openThenEventWindow(actionEvents));
                    this.game.queueSimpleStep(() => context.refill());
                }
            };
        });
        if(effectsToRemove.length > 0) {
            this.unapplyAndRemove((effect) => effectsToRemove.includes(effect));
        }
        if(triggers.length > 0) {
            this.game.openSimultaneousEffectWindow(triggers);
        }
    }

    removeLastingEffects(card: EffectSource) {
        this.unapplyAndRemove(
            (effect) =>
                effect.match === card &&
                effect.duration !== Duration.Persistent &&
                !effect.canChangeZoneOnce &&
                (!effect.canChangeZoneNTimes || effect.canChangeZoneNTimes === 0)
        );
        for(const effect of this.effects) {
            if(effect.match === card && effect.canChangeZoneOnce) {
                effect.canChangeZoneOnce = false;
            }
            if(effect.match === card && effect.canChangeZoneNTimes > 0) {
                effect.canChangeZoneNTimes--;
            }
        }
    }

    checkEffects(prevStateChanged = false, loops = 0) {
        if(!prevStateChanged && !this.newEffect) {
            return false;
        }
        let stateChanged = false;
        this.newEffect = false;
        // Check each effect's condition and find new targets
        stateChanged = this.effects.reduce((stateChanged, effect) => effect.checkCondition(stateChanged), stateChanged);
        if(loops === 10) {
            throw new Error('EffectEngine.checkEffects looped 10 times');
        } else if(stateChanged || this.newEffect) {
            this.checkEffects(stateChanged, loops + 1);
        }
        return stateChanged;
    }

    onConflictFinished() {
        this.newEffect = this.unapplyAndRemove((effect) => effect.duration === Duration.UntilEndOfConflict);
    }

    onDuelFinished() {
        this.newEffect = this.unapplyAndRemove((effect) => effect.duration === Duration.UntilEndOfDuel);
    }

    onPhaseEnded() {
        this.newEffect = this.unapplyAndRemove((effect) => effect.duration === Duration.UntilEndOfPhase);
    }

    onRoundEnded() {
        this.newEffect = this.unapplyAndRemove((effect) => effect.duration === Duration.UntilEndOfRound);
    }

    onPassActionPhasePriority(event: GameEvent<EventName.OnPassActionPhasePriority>) {
        for(const effect of this.effects) {
            if(
                effect.duration === Duration.UntilSelfPassPriority &&
                event.player === effect.context.player
            ) {
                effect.duration = Duration.UntilPassPriority;
            }
        }

        this.newEffect = this.unapplyAndRemove((effect) => effect.duration === Duration.UntilPassPriority);
        for(const effect of this.effects) {
            if(
                effect.duration === Duration.UntilOpponentPassPriority ||
                effect.duration === Duration.UntilSelfPassPriority
            ) {
                effect.duration = Duration.UntilPassPriority;
            } else if(effect.duration === Duration.UntilNextPassPriority) {
                effect.duration = Duration.UntilOpponentPassPriority;
            }
        }
    }

    registerCustomDurationEvents(effect: Effect) {
        if(!effect.until) {
            return;
        }

        const handler = this.createCustomDurationHandler(effect);
        for(const eventName of Object.keys(effect.until)) {
            this.customDurationEvents.push({
                name: eventName,
                handler: handler,
                effect: effect
            });
            this.game.on(eventName, handler);
        }
    }

    unregisterCustomDurationEvents(effect: Effect) {
        const remainingEvents: CustomDurationEvent[] = [];
        for(const event of this.customDurationEvents) {
            if(event.effect === effect) {
                this.game.removeListener(event.name, event.handler);
            } else {
                remainingEvents.push(event);
            }
        }
        this.customDurationEvents = remainingEvents;
    }

    createCustomDurationHandler(customDurationEffect: Effect) {
        // the custom duration events are emitted with the event alone
        return (...args: unknown[]) => {
            const event = args[0];
            if(event instanceof Event && isEnumValue(EventName, event.name) && untilEnds(customDurationEffect.until, event.name, event)) {
                customDurationEffect.cancel();
                this.unregisterCustomDurationEvents(customDurationEffect);
                this.effects = this.effects.filter((effect) => effect !== customDurationEffect);
                if(customDurationEffect.endingMessage) {
                    this.game.addMessage(customDurationEffect.endingMessage);
                }
            }
        };
    }

    unapplyAndRemove(match: (effect: Effect) => boolean) {
        const toRemove: Effect[] = [];
        for(const effect of this.effects) {
            if(match(effect)) {
                toRemove.push(effect);
                effect.cancel();
                if(effect.duration === Duration.Custom) {
                    this.unregisterCustomDurationEvents(effect);
                }
            }
        }
        if(toRemove.length > 0) {
            this.effects = this.effects.filter((effect) => !toRemove.includes(effect));
        }
        return toRemove.length > 0;
    }

    getDebugInfo() {
        return this.effects.map((effect) => effect.getDebugInfo());
    }
}
