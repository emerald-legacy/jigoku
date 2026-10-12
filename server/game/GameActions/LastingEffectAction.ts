import type { GameObject } from '../GameObject.js';
import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { BaseAbility } from '../BaseAbility.js';
import { Duration, EventName, Players } from '../Constants.js';
import type { EffectUntil } from '../Effects/ActiveEffect.js';
import type Player from '../Player.js';
import { GameAction, targetList, type ActionEvent, type GameActionProperties } from './GameAction.js';
import type { Event } from '../Events/Event.js';
import type { EffectFactory } from '../Effects/EffectBuilder.js';

/** The lasting-effect fields, shared by the player, card and ring variants. */
export interface LastingEffectFields {
    duration?: Duration;
    condition?: (context: AbilityContext) => boolean;
    until?: EffectUntil;
    effect?: EffectFactory | EffectFactory[];
    ability?: BaseAbility;
}

export interface LastingEffectGeneralProperties extends GameActionProperties, LastingEffectFields {}

/** A single effect factory becomes a one-element list; a missing one becomes an empty list. */
export function toEffectList(effect: EffectFactory | EffectFactory[] | undefined): EffectFactory[] {
    if(effect === undefined) {
        return [];
    }
    return Array.isArray(effect) ? effect : [effect];
}

export type LastingEffectProperties = LastingEffectGeneralProperties;

export interface PlayerLastingEffectProperties extends LastingEffectGeneralProperties {
    target?: Player | Player[];
}

/** As written on cards: `target` may also be relative to the ability's player (`Players.Any` for both). */
export type PlayerLastingEffectInput = Omit<PlayerLastingEffectProperties, 'target'> & { target?: Players | Player | Player[] };

function playersFor(target: Players | Player | Player[], context: AbilityContext): Player | Player[] {
    switch(target) {
        case Players.Self:
            return context.player;
        case Players.Opponent:
            return context.player.opponent ?? [];
        case Players.Any:
        case Players.All:
            return context.game.getPlayers();
        default:
            return target;
    }
}

export class LastingEffectAction<C extends AbilityContext = AbilityContext> extends GameAction<LastingEffectProperties, EventName.OnEffectApplied, C, 'duration'> {
    name = 'applyLastingEffect';
    eventName = EventName.OnEffectApplied;
    effect = 'apply a lasting effect';
    defaultProperties = {
        duration: Duration.UntilEndOfConflict
    };

    getProperties(context: C, additionalProperties: ActionOverrides = {}) {
        const properties = super.getProperties(context, additionalProperties);
        return Object.assign(properties, { effect: toEffectList(properties.effect) });
    }

    hasLegalTarget(context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.effect.length > 0;
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: Record<string, unknown>): void {
        if(this.hasLegalTarget(context, additionalProperties)) {
            events.push(this.getEvent(null, context, additionalProperties));
        }
    }

    eventHandler(event: ActionEvent<EventName, C>, additionalProperties: Record<string, unknown>): void {
        const properties = this.getProperties(event.context, additionalProperties);
        if(!properties.ability) {
            properties.ability = event.context.ability;
        }
        event.context.source.applyDurationEffect(properties.duration, properties);
    }
}

/** A lasting effect on a duel: by default the current duel, until it ends. */
export class DuelLastingEffectAction<C extends AbilityContext = AbilityContext> extends LastingEffectAction<C> {
    defaultProperties = {
        duration: Duration.UntilEndOfDuel
    };

    defaultTargets(context: C): GameObject[] {
        return context.game.currentDuel ? [context.game.currentDuel] : [];
    }
}

/** A lasting effect on players: by default the ability's player. */
export class PlayerLastingEffectAction<C extends AbilityContext = AbilityContext> extends GameAction<PlayerLastingEffectProperties, EventName.OnEffectApplied, C, 'duration'> {
    constructor(propertyFactory: PlayerLastingEffectInput | ((context: C) => PlayerLastingEffectInput)) {
        super((context: C) => {
            const { target, ...properties } = typeof propertyFactory === 'function' ? propertyFactory(context) : propertyFactory;
            // without a target the default (the ability's player) applies
            return target === undefined ? properties : { ...properties, target: playersFor(target, context) };
        });
    }

    name = 'applyLastingEffect';
    eventName = EventName.OnEffectApplied;
    effect = 'apply a lasting effect';
    defaultProperties = {
        duration: Duration.UntilEndOfConflict
    };

    defaultTargets(context: C): Player[] {
        return context.player ? [context.player] : [];
    }

    getProperties(context: C, additionalProperties: ActionOverrides = {}) {
        const properties = super.getProperties(context, additionalProperties);
        return Object.assign(properties, { effect: toEffectList(properties.effect) });
    }

    hasLegalTarget(context: C, additionalProperties: ActionOverrides = {}): boolean {
        return this.getProperties(context, additionalProperties).effect.length > 0;
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: Record<string, unknown>): void {
        if(this.hasLegalTarget(context, additionalProperties)) {
            events.push(this.getEvent(null, context, additionalProperties));
        }
    }

    eventHandler(event: ActionEvent<EventName, C>, additionalProperties: Record<string, unknown>): void {
        const { target, ...properties } = this.getProperties(event.context, additionalProperties);
        if(!properties.ability) {
            properties.ability = event.context.ability;
        }
        const players = targetList(target);
        // one effect for both players, so it reports and expires once
        if(players.length > 1 && event.context.game.getPlayers().every((player) => players.includes(player))) {
            event.context.source.applyDurationEffect(properties.duration, { ...properties, targetController: Players.Any });
            return;
        }
        for(const player of players) {
            event.context.source.applyDurationEffect(properties.duration, { ...properties, targetController: player });
        }
    }
}
