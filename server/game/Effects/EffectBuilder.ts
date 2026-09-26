import type { AbilityContext } from '../AbilityContext.js';
import type BaseAbility from '../BaseAbility.js';
import type BaseCard from '../BaseCard.js';
import type EffectSource from '../EffectSource.js';
import type { Duration, EffectName, Location } from '../Constants.js';
import type Game from '../Game.js';
import type { GameAction, GameActionProperties } from '../GameActions/GameAction.js';
import type { GameObject } from '../GameObject.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';
import type { StatusToken } from '../StatusToken.js';
import type Effect from './Effect.js';
import type { EffectProperties, EffectUntil } from './Effect.js';
import type { EffectBase } from './EffectBase.js';
import type { EffectValueMap, FlexibleEffectName } from './EffectValueMap.js';
import CardEffect from './CardEffect.js';
import ConflictEffect from './ConflictEffect.js';
import DetachedEffect, { type DetachedValue } from './DetachedEffect.js';
import DuelEffect from './DuelEffect.js';
import DynamicEffect, { type DynamicValue } from './DynamicEffect.js';
import PlayerEffect from './PlayerEffect.js';
import RingEffect from './RingEffect.js';
import StaticEffect, { type StaticValue } from './StaticEffect.js';
import type { Duel } from '../Duel.js';
import type { Conflict } from '../Conflict.js';

export type { DetachedValue, DynamicValue };

export type EffectTarget = Player | Ring | BaseCard | StatusToken | Duel | Conflict;
export type EffectFactory = (game: Game, source: EffectSource, props: Props) => Effect;

type Props = {
    targetLocation?: Location | Location[];
    canChangeZoneOnce?: boolean;
    canChangeZoneNTimes?: number;
    duration?: Duration;
    condition?: (context: AbilityContext) => boolean;
    until?: EffectUntil;
    ability?: BaseAbility;
    target?: EffectTarget | EffectTarget[];
    cannotBeCancelled?: boolean;
    optional?: boolean;
    parentAction?: GameAction<GameActionProperties>;
};

/** A value, or a calculation of it for each target. Values are never functions, so a function is a calculation. */
export type FlexibleValue<V, T> = V | DynamicValue<V, T>;

function isCalculation<V, T>(value: FlexibleValue<V, T>): value is DynamicValue<V, T> {
    return typeof value === 'function';
}

type Container<T extends GameObject> = new (game: Game, source: EffectSource, props: EffectProperties<T>, effect: EffectBase<EffectName, T>) => Effect<T>;

/** Effect factories for one kind of target; each checks its value against `EffectValueMap`. */
function effectsFor<T extends GameObject>(Container: Container<T>) {
    const staticEffect = <N extends EffectName>(type: N, value: StaticValue<N, T>): EffectFactory =>
        (game, source, props) => new Container(game, source, props, new StaticEffect<N, T>(type, value));
    const dynamicEffect = <N extends EffectName>(type: N, value: DynamicValue<EffectValueMap[N], T>): EffectFactory =>
        (game, source, props) => new Container(game, source, props, new DynamicEffect<N, T>(type, value));
    return {
        static: staticEffect,
        dynamic: dynamicEffect,
        detached: <N extends EffectName, S>(type: N, value: DetachedValue<T, S>): EffectFactory =>
            (game, source, props) => new Container(game, source, props, new DetachedEffect<N, T, S>(type, value)),
        flexible: <N extends FlexibleEffectName>(type: N, value: FlexibleValue<EffectValueMap[N], T>): EffectFactory =>
            isCalculation(value) ? dynamicEffect(type, value) : staticEffect(type, value)
    };
}

export const EffectBuilder = {
    card: effectsFor(CardEffect),
    player: effectsFor(PlayerEffect),
    conflict: effectsFor(ConflictEffect),
    ring: effectsFor(RingEffect),
    duel: effectsFor(DuelEffect)
};
