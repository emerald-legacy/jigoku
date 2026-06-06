import { Duration, EffectName, EventName } from './Constants.js';
import type { AbilityContext } from './AbilityContext.js';
import type { GameAction } from './GameActions/GameAction.js';
import type Effect from './Effects/Effect.js';
import type EffectSource from './EffectSource.js';
import type { Event } from './Events/Event.js';
import type { GameEvent } from './Events/EventPayloads.js';
import type { MsgArg } from './GameChat.js';
import { EventRegistrar } from './EventRegistrar.js';
import type Game from './Game.js';

type DelayedEffectValue = {
    condition?: (context: AbilityContext) => boolean;
    when?: Record<string, (event: Event, context: AbilityContext) => boolean>;
    multipleTrigger?: boolean;
    onlyRemoveOnSuccess?: boolean;
    gameAction: GameAction;
    message?: string;
    messageArgs?: unknown[] | ((context: AbilityContext, targets: unknown[]) => unknown[]);
};

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
        let effectsToTrigger: Effect[] = [];
        const effectsToRemove: Effect[] = [];
        for(const effect of this.effects.filter(
            (effect) => effect.isEffectActive() && effect.effect.type === EffectName.DelayedEffect
        )) {
            const properties = effect.effect.getValue<DelayedEffectValue>();
            if(properties.condition) {
                if(properties.condition(effect.context)) {
                    effectsToTrigger.push(effect);
                }
            } else {
                const triggeringEvents = events.filter((event) => properties.when?.[event.name]);
                if(triggeringEvents.length > 0) {
                    let effectTriggered = false;
                    if(triggeringEvents.some((event) => properties.when?.[event.name](event, effect.context))) {
                        effectsToTrigger.push(effect);
                        effectTriggered = true;
                    }
                    if(!properties.multipleTrigger && effect.duration !== Duration.Persistent && (!properties.onlyRemoveOnSuccess || effectTriggered)) {
                        effectsToRemove.push(effect);
                    }
                }
            }
        }
        const triggers = effectsToTrigger.map((effect) => {
            const properties = effect.effect.getValue<DelayedEffectValue>();
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
                        this.game.addMessage(properties.message, ...(messageArgs as MsgArg[]));
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
        return (...args: unknown[]) => {
            const event = args[0] as Event;
            const until = customDurationEffect.until;
            const listener = until?.[event.name as EventName] as ((...args: unknown[]) => unknown) | undefined;
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
