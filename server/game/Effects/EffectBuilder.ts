import type { AbilityContext } from '../AbilityContext.js';
import type BaseAbility from '../BaseAbility.js';
import type BaseCard from '../BaseCard.js';
import type EffectSource from '../EffectSource.js';
import type { Durations, EffectNames, Locations } from '../Constants.js';
import type Game from '../Game.js';
import type { GameAction, GameActionProperties } from '../GameActions/GameAction.js';
import type { WhenType } from '../Interfaces.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';
import type { StatusToken } from '../StatusToken.js';
import type Effect from './Effect.js';
import CardEffect from './CardEffect.js';
import ConflictEffect from './ConflictEffect.js';
import DetachedEffect from './DetachedEffect.js';
import DuelEffect from './DuelEffect.js';
import DynamicEffect from './DynamicEffect.js';
import PlayerEffect from './PlayerEffect.js';
import RingEffect from './RingEffect.js';
import StaticEffect from './StaticEffect.js';

type PlayerOrRingOrCardOrToken = Player | Ring | BaseCard | StatusToken;

export type EffectTarget = PlayerOrRingOrCardOrToken;
type StaticValue = unknown;
type DynamicValue = (target: EffectTarget, context: AbilityContext) => unknown;
type DetachedValue = {
    apply: (target: EffectTarget, context: AbilityContext, state?: unknown) => unknown;
    unapply: (target: EffectTarget, context: AbilityContext, state?: unknown) => unknown;
};
type FlexibleValue = StaticValue | DynamicValue;

export type EffectFactory = (game: Game, source: EffectSource, props: Props) => Effect;

type Props = {
    targetLocation?: Locations | Locations[];
    canChangeZoneOnce?: boolean;
    canChangeZoneNTimes?: number;
    duration?: Durations;
    condition?: (context: AbilityContext) => boolean;
    until?: WhenType;
    ability?: BaseAbility;
    target?: PlayerOrRingOrCardOrToken | PlayerOrRingOrCardOrToken[];
    cannotBeCancelled?: boolean;
    optional?: boolean;
    parentAction?: GameAction<GameActionProperties>;
};

export const EffectBuilder = {
    card: {
        static: (type: EffectNames, value: StaticValue) => (game: Game, source: EffectSource, props: Props) =>
            new CardEffect(game, source, props, new StaticEffect(type, value)),
        dynamic: (type: EffectNames, value: DynamicValue) => (game: Game, source: EffectSource, props: Props) =>
            new CardEffect(game, source, props, new DynamicEffect(type, value)),
        detached: (type: EffectNames, value: DetachedValue) => (game: Game, source: EffectSource, props: Props) =>
            new CardEffect(game, source, props, new DetachedEffect(type, value.apply, value.unapply)),
        flexible: (type: EffectNames, value: FlexibleValue) =>
            typeof value === 'function'
                ? EffectBuilder.card.dynamic(type, value as DynamicValue)
                : EffectBuilder.card.static(type, value)
    },
    player: {
        static: (type: EffectNames, value: StaticValue) => (game: Game, source: EffectSource, props: Props) =>
            new PlayerEffect(game, source, props, new StaticEffect(type, value)),
        dynamic: (type: EffectNames, value: DynamicValue) => (game: Game, source: EffectSource, props: Props) =>
            new PlayerEffect(game, source, props, new DynamicEffect(type, value)),
        detached: (type: EffectNames, value: DetachedValue) => (game: Game, source: EffectSource, props: Props) =>
            new PlayerEffect(game, source, props, new DetachedEffect(type, value.apply, value.unapply)),
        flexible: (type: EffectNames, value: FlexibleValue) =>
            typeof value === 'function'
                ? EffectBuilder.player.dynamic(type, value as DynamicValue)
                : EffectBuilder.player.static(type, value)
    },
    conflict: {
        static: (type: EffectNames, value: StaticValue) => (game: Game, source: EffectSource, props: Props) =>
            new ConflictEffect(game, source, props, new StaticEffect(type, value)),
        dynamic: (type: EffectNames, value: DynamicValue) => (game: Game, source: EffectSource, props: Props) =>
            new ConflictEffect(game, source, props, new DynamicEffect(type, value)),
        detached: (type: EffectNames, value: DetachedValue) => (game: Game, source: EffectSource, props: Props) =>
            new ConflictEffect(game, source, props, new DetachedEffect(type, value.apply, value.unapply)),
        flexible: (type: EffectNames, value: FlexibleValue) =>
            typeof value === 'function'
                ? EffectBuilder.conflict.dynamic(type, value as DynamicValue)
                : EffectBuilder.conflict.static(type, value)
    },
    ring: {
        static: (type: EffectNames, value: StaticValue) => (game: Game, source: EffectSource, props: Props) =>
            new RingEffect(game, source, props, new StaticEffect(type, value)),
        dynamic: (type: EffectNames, value: DynamicValue) => (game: Game, source: EffectSource, props: Props) =>
            new RingEffect(game, source, props, new DynamicEffect(type, value)),
        detached: (type: EffectNames, value: DetachedValue) => (game: Game, source: EffectSource, props: Props) =>
            new RingEffect(game, source, props, new DetachedEffect(type, value.apply, value.unapply)),
        flexible: (type: EffectNames, value: FlexibleValue) =>
            typeof value === 'function'
                ? EffectBuilder.ring.dynamic(type, value as DynamicValue)
                : EffectBuilder.ring.static(type, value)
    },
    duel: {
        static: (type: EffectNames, value: StaticValue) => (game: Game, source: EffectSource, props: Props) =>
            new DuelEffect(game, source, props, new StaticEffect(type, value)),
        dynamic: (type: EffectNames, value: DynamicValue) => (game: Game, source: EffectSource, props: Props) =>
            new DuelEffect(game, source, props, new DynamicEffect(type, value)),
        detached: (type: EffectNames, value: DetachedValue) => (game: Game, source: EffectSource, props: Props) =>
            new DuelEffect(game, source, props, new DetachedEffect(type, value.apply, value.unapply)),
        flexible: (type: EffectNames, value: FlexibleValue) =>
            typeof value === 'function'
                ? EffectBuilder.duel.dynamic(type, value as DynamicValue)
                : EffectBuilder.duel.static(type, value)
    }
};
