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
export interface LastingEffectFields<Context extends AbilityContext = AbilityContext> {
    duration?: Duration;
    condition?(context: Context): boolean;
    until?: EffectUntil;
    effect?: EffectFactory | EffectFactory[];
    ability?: BaseAbility;
    /** Whose cards or which players the effect may apply to, relative to the ability's player; `Players.Any` for both. */
    targetController?: Players | Player;
    /** A chat line when an effect with `Duration.Custom` ends. */
    endingMessage?: string;
}

export interface LastingEffectGeneralProperties<Context extends AbilityContext = AbilityContext> extends GameActionProperties, LastingEffectFields<Context> {}

/** A single effect factory becomes a one-element list; a missing one becomes an empty list. */
export function toEffectList(effect: EffectFactory | EffectFactory[] | undefined): EffectFactory[] {
    if(effect === undefined) {
        return [];
    }
    return Array.isArray(effect) ? effect : [effect];
}

export type LastingEffectProperties<Context extends AbilityContext = AbilityContext> = LastingEffectGeneralProperties<Context>;

export interface PlayerLastingEffectProperties<Context extends AbilityContext = AbilityContext> extends LastingEffectGeneralProperties<Context> {
    target?: Player | Player[];
}

/** As written on cards: `target` may also be relative to the ability's player (`Players.Any` for both). */
export type PlayerLastingEffectInput<Context extends AbilityContext = AbilityContext> = Omit<PlayerLastingEffectProperties<Context>, 'target'> & { target?: Players | Player | Player[] };

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

export class LastingEffectAction<Context extends AbilityContext = AbilityContext> extends GameAction<LastingEffectProperties, EventName.OnEffectApplied, Context, 'duration'> {
    override name = 'applyLastingEffect';
    override eventName = EventName.OnEffectApplied;
    override effect = 'apply a lasting effect';
    override defaultProperties = {
        duration: Duration.UntilEndOfConflict
    };

    override getProperties(context: Context, additionalProperties: ActionOverrides = {}) {
        const properties = super.getProperties(context, additionalProperties);
        return Object.assign(properties, { effect: toEffectList(properties.effect) });
    }

    override hasLegalTarget(context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.effect.length > 0;
    }

    override addEventsToArray(events: Event[], context: Context, additionalProperties: Record<string, unknown>): void {
        if(this.hasLegalTarget(context, additionalProperties)) {
            events.push(this.getEvent(null, context, additionalProperties));
        }
    }

    override eventHandler(event: ActionEvent<EventName, Context>, additionalProperties: Record<string, unknown>): void {
        const properties = this.getProperties(event.context, additionalProperties);
        if(!properties.ability) {
            properties.ability = event.context.ability;
        }
        event.context.source.applyDurationEffect(properties.duration, properties);
    }
}

/** A lasting effect on a duel: by default the current duel, until it ends. */
export class DuelLastingEffectAction<Context extends AbilityContext = AbilityContext> extends LastingEffectAction<Context> {
    override defaultProperties = {
        duration: Duration.UntilEndOfDuel
    };

    override defaultTargets(context: Context): GameObject[] {
        return context.game.currentDuel ? [context.game.currentDuel] : [];
    }
}

/** A lasting effect on players: by default the ability's player. */
export class PlayerLastingEffectAction<Context extends AbilityContext = AbilityContext> extends GameAction<PlayerLastingEffectProperties, EventName.OnEffectApplied, Context, 'duration'> {
    constructor(propertyFactory: PlayerLastingEffectInput<Context> | ((context: Context) => PlayerLastingEffectInput<Context>)) {
        super((context: Context) => {
            const { target, ...properties } = typeof propertyFactory === 'function' ? propertyFactory(context) : propertyFactory;
            // without a target the default (the ability's player) applies
            return target === undefined ? properties : { ...properties, target: playersFor(target, context) };
        });
    }

    override name = 'applyLastingEffect';
    override eventName = EventName.OnEffectApplied;
    override effect = 'apply a lasting effect';
    override defaultProperties = {
        duration: Duration.UntilEndOfConflict
    };

    override defaultTargets(context: Context): Player[] {
        return context.player ? [context.player] : [];
    }

    override getProperties(context: Context, additionalProperties: ActionOverrides = {}) {
        const properties = super.getProperties(context, additionalProperties);
        return Object.assign(properties, { effect: toEffectList(properties.effect) });
    }

    override hasLegalTarget(context: Context, additionalProperties: ActionOverrides = {}): boolean {
        return this.getProperties(context, additionalProperties).effect.length > 0;
    }

    override addEventsToArray(events: Event[], context: Context, additionalProperties: Record<string, unknown>): void {
        if(this.hasLegalTarget(context, additionalProperties)) {
            events.push(this.getEvent(null, context, additionalProperties));
        }
    }

    override eventHandler(event: ActionEvent<EventName, Context>, additionalProperties: Record<string, unknown>): void {
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
