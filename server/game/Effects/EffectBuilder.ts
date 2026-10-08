import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import type { EffectSource } from '../EffectSource.js';
import type { EffectName } from '../Constants.js';
import type Game from '../Game.js';
import type { GameObject } from '../GameObject.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';
import type { StatusToken } from '../StatusToken.js';
import type { Effect } from './Effect.js';
import type { EffectProperties } from './Effect.js';
import type { EffectBase } from './EffectBase.js';
import type { EffectValueMap, FlexibleEffectName } from './EffectValueMap.js';
import { CardEffect } from './CardEffect.js';
import { ConflictEffect } from './ConflictEffect.js';
import { DetachedEffect, type DetachedValue } from './DetachedEffect.js';
import { DuelEffect } from './DuelEffect.js';
import { DynamicEffect, type DynamicValue } from './DynamicEffect.js';
import { PlayerEffect } from './PlayerEffect.js';
import { RingEffect } from './RingEffect.js';
import { StaticEffect, type StaticValue } from './StaticEffect.js';
import type { Duel } from '../Duel.js';
import type { Conflict } from '../Conflict.js';

export type EffectTarget = Player | Ring | BaseCard | StatusToken | Duel | Conflict;

// Method syntax on purpose: a factory for a narrower target type is still an `EffectFactory`.
interface Factory<T extends GameObject> {
    create(game: Game, source: EffectSource, props: EffectProperties<T>): Effect;
}
/** `appliesTo` is never set; it records what the effect targets, so `match` can be typed by it. */
export type EffectFactory<T extends GameObject = EffectTarget> = Factory<T>['create'] & { readonly appliesTo?: T };

/** A value, or a calculation of it for each target. Values are never functions, so a function is a calculation. */
export type FlexibleValue<V, T = DrawCard> = V | DynamicValue<V, T>;

function isCalculation<V, T>(value: FlexibleValue<V, T>): value is DynamicValue<V, T> {
    return typeof value === 'function';
}

type Container<T extends GameObject> = new (game: Game, source: EffectSource, props: EffectProperties<T>, effect: EffectBase<EffectName, T>) => Effect<T>;

/** Effect factories for one kind of target; each checks its value against `EffectValueMap`. */
function effectsFor<T extends GameObject>(Container: Container<T>) {
    const staticEffect = <N extends EffectName>(type: N, value: StaticValue<N, T>): EffectFactory<T> =>
        (game, source, props) => new Container(game, source, props, new StaticEffect<N, T>(type, value));
    const dynamicEffect = <N extends EffectName>(type: N, value: DynamicValue<EffectValueMap[N], T>): EffectFactory<T> =>
        (game, source, props) => new Container(game, source, props, new DynamicEffect<N, T>(type, value));
    return {
        static: staticEffect,
        dynamic: dynamicEffect,
        detached: <N extends EffectName, S>(type: N, value: DetachedValue<T, S>): EffectFactory<T> =>
            (game, source, props) => new Container(game, source, props, new DetachedEffect<N, T, S>(type, value)),
        flexible: <N extends FlexibleEffectName>(type: N, value: FlexibleValue<EffectValueMap[N], T>): EffectFactory<T> =>
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
