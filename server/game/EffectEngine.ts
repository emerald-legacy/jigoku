import { Duration, EffectName, EventName } from './Constants.js';
import type { ActiveEffect } from './Effects/ActiveEffect.js';
import type { EffectUntil } from './Effects/ActiveEffect.js';
import { isEffectOf } from './Effects/types.js';
import type { DelayedEffectValue, DelayedEffectWhen } from './Effects/EffectValueMap.js';
import type { AbilityContext } from './AbilityContext.js';
import { eventNamesIn, isEnumValue } from './utils/helpers.js';
import type { EffectSource } from './EffectSource.js';
import { Event } from './Events/Event.js';
import type { GameEvent } from './Events/EventPayloads.js';
import { EventRegistrar } from './EventRegistrar.js';
import type Game from './Game.js';

function fireTrigger<N extends EventName>(when: DelayedEffectWhen, name: N, event: Event, context: AbilityContext): unknown {
    const trigger = when[name];
    return trigger && event.is(name) && trigger(event, context);
}

function untilEnds<N extends EventName>(until: EffectUntil, name: N, event: Event): unknown {
    const ends = until[name];
    return ends && event.is(name) && ends(event);
}

interface CustomDurationEvent {
    name: EventName;
    handler: (event: Event) => void;
    effect: ActiveEffect;
}

export class EffectEngine {
    events: EventRegistrar;
    effects: Array<ActiveEffect> = [];
    customDurationEvents: CustomDurationEvent[] = [];
    newEffect = false;

    constructor(private game: Game) {
        this.events = new EventRegistrar(game);
        this.events.register({
            [EventName.OnConflictFinished]: () => this.onConflictFinished(),
            [EventName.OnPhaseEnded]: () => this.onPhaseEnded(),
            [EventName.OnRoundEnded]: () => this.onRoundEnded(),
            [EventName.OnDuelFinished]: () => this.onDuelFinished(),
            [EventName.OnPassActionPhasePriority]: (event) => this.onPassActionPhasePriority(event)
        });
    }

    add(effect: ActiveEffect) {
        this.effects.push(effect);
        if(effect.duration === Duration.Custom) {
            this.registerCustomDurationEvents(effect);
        }
        this.newEffect = true;
        return effect;
    }

    checkDelayedEffects(events: Event[]) {
        const effectsToTrigger: { effect: ActiveEffect; properties: DelayedEffectValue }[] = [];
        const effectsToRemove: ActiveEffect[] = [];
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
                    if(properties.message && properties.gameAction.hasLegalTarget(context, { target: targets })) {
                        this.game.addMessage(properties.message(context, targets));
                    }
                    const actionEvents: Event[] = [];
                    properties.gameAction.addEventsToArray(actionEvents, context, { target: targets });
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
        this.newEffect = this.unapplyAndRemove((effect) => effect.duration === Duration.UntilEndOfConflict) || this.newEffect;
    }

    onDuelFinished() {
        this.newEffect = this.unapplyAndRemove((effect) => effect.duration === Duration.UntilEndOfDuel) || this.newEffect;
    }

    onPhaseEnded() {
        this.newEffect = this.unapplyAndRemove((effect) => effect.duration === Duration.UntilEndOfPhase) || this.newEffect;
    }

    onRoundEnded() {
        this.newEffect = this.unapplyAndRemove((effect) => effect.duration === Duration.UntilEndOfRound) || this.newEffect;
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

        this.newEffect = this.unapplyAndRemove((effect) => effect.duration === Duration.UntilPassPriority) || this.newEffect;
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

    registerCustomDurationEvents(effect: ActiveEffect) {
        if(!effect.until) {
            return;
        }

        const handler = this.createCustomDurationHandler(effect);
        for(const eventName of eventNamesIn(effect.until)) {
            this.customDurationEvents.push({
                name: eventName,
                handler: handler,
                effect: effect
            });
            this.game.on(eventName, handler);
        }
    }

    unregisterCustomDurationEvents(effect: ActiveEffect) {
        const remainingEvents: CustomDurationEvent[] = [];
        for(const event of this.customDurationEvents) {
            if(event.effect === effect) {
                this.game.off(event.name, event.handler);
            } else {
                remainingEvents.push(event);
            }
        }
        this.customDurationEvents = remainingEvents;
    }

    createCustomDurationHandler(customDurationEffect: ActiveEffect) {
        return (event: Event) => {
            if(untilEnds(customDurationEffect.until, event.name, event)) {
                customDurationEffect.cancel();
                this.unregisterCustomDurationEvents(customDurationEffect);
                this.effects = this.effects.filter((effect) => effect !== customDurationEffect);
                if(customDurationEffect.endingMessage) {
                    this.game.addMessage(customDurationEffect.endingMessage);
                }
            }
        };
    }

    unapplyAndRemove(match: (effect: ActiveEffect) => boolean) {
        const toRemove: ActiveEffect[] = [];
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
