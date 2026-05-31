import { Durations, EffectNames, EventNames } from './Constants.js';
import type Effect from './Effects/Effect.js';
import type EffectSource from './EffectSource.js';
import type { Event } from './Events/Event.js';
import { EventRegistrar } from './EventRegistrar.js';
import type Game from './Game.js';

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
            EventNames.OnConflictFinished,
            EventNames.OnPhaseEnded,
            EventNames.OnRoundEnded,
            EventNames.OnDuelFinished,
            EventNames.OnPassActionPhasePriority
        ]);
    }

    add(effect: Effect) {
        this.effects.push(effect);
        if(effect.duration === Durations.Custom) {
            this.registerCustomDurationEvents(effect);
        }
        this.newEffect = true;
        return effect;
    }

    checkDelayedEffects(events: Event[]) {
        let effectsToTrigger: Effect[] = [];
        const effectsToRemove: Effect[] = [];
        for(const effect of this.effects.filter(
            (effect) => effect.isEffectActive() && effect.effect.type === EffectNames.DelayedEffect
        )) {
            const properties = effect.effect.getValue();
            if(properties.condition) {
                if(properties.condition(effect.context)) {
                    effectsToTrigger.push(effect);
                }
            } else {
                const triggeringEvents = events.filter((event) => properties.when[event.name]);
                if(triggeringEvents.length > 0) {
                    let effectTriggered = false;
                    if(triggeringEvents.some((event) => properties.when[event.name](event, effect.context))) {
                        effectsToTrigger.push(effect);
                        effectTriggered = true;
                    }
                    if(!properties.multipleTrigger && effect.duration !== Durations.Persistent && (!properties.onlyRemoveOnSuccess || effectTriggered)) {
                        effectsToRemove.push(effect);
                    }
                }
            }
        }
        const triggers = effectsToTrigger.map((effect) => {
            const properties = effect.effect.getValue();
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
                        this.game.addMessage(properties.message, ...messageArgs);
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
                effect.duration !== Durations.Persistent &&
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
        this.newEffect = this.unapplyAndRemove((effect) => effect.duration === Durations.UntilEndOfConflict);
    }

    onDuelFinished() {
        this.newEffect = this.unapplyAndRemove((effect) => effect.duration === Durations.UntilEndOfDuel);
    }

    onPhaseEnded() {
        this.newEffect = this.unapplyAndRemove((effect) => effect.duration === Durations.UntilEndOfPhase);
    }

    onRoundEnded() {
        this.newEffect = this.unapplyAndRemove((effect) => effect.duration === Durations.UntilEndOfRound);
    }

    onPassActionPhasePriority(event: Event) {
        for(const effect of this.effects) {
            if(
                effect.duration === Durations.UntilSelfPassPriority &&
                event.player === effect.context.player
            ) {
                effect.duration = Durations.UntilPassPriority;
            }
        }

        this.newEffect = this.unapplyAndRemove((effect) => effect.duration === Durations.UntilPassPriority);
        for(const effect of this.effects) {
            if(
                effect.duration === Durations.UntilOpponentPassPriority ||
                effect.duration === Durations.UntilSelfPassPriority
            ) {
                effect.duration = Durations.UntilPassPriority;
            } else if(effect.duration === Durations.UntilNextPassPriority) {
                effect.duration = Durations.UntilOpponentPassPriority;
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
        return (...args: unknown[]) => {
            const event = args[0] as Event;
            const until: any = customDurationEffect.until;
            const listener = until?.[event.name];
            if(listener && listener(...args)) {
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
                if(effect.duration === Durations.Custom) {
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
