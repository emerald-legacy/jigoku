import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import type { EffectSource } from '../EffectSource.js';
import type { EffectName } from '../Constants.js';
import type Game from '../Game.js';
import type { GameObject } from '../GameObject.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';
import type { StatusToken } from '../StatusToken.js';
import type { ActiveEffect } from './ActiveEffect.js';
import type { EffectProperties } from './ActiveEffect.js';
import type { EffectApplier } from './EffectApplier.js';
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
interface Factory<Target extends GameObject> {
    create(game: Game, source: EffectSource, props: EffectProperties<Target>): ActiveEffect;
}
/** `appliesTo` is never set; it records what the effect targets, so `match` can be typed by it. */
export type EffectFactory<Target extends GameObject = EffectTarget> = Factory<Target>['create'] & { readonly appliesTo?: Target };

/** A value, or a calculation of it for each target. Values are never functions, so a function is a calculation. */
export type FlexibleValue<Value, Target = DrawCard> = Value | DynamicValue<Value, Target>;

function isCalculation<Value, Target>(value: FlexibleValue<Value, Target>): value is DynamicValue<Value, Target> {
    return typeof value === 'function';
}

type Container<Target extends GameObject> = new (game: Game, source: EffectSource, props: EffectProperties<Target>, effect: EffectApplier<EffectName, Target>) => ActiveEffect<Target>;

/** Effect factories for one kind of target; each checks its value against `EffectValueMap`. */
function effectsFor<Target extends GameObject>(Container: Container<Target>) {
    const staticEffect = <EffectType extends EffectName>(type: EffectType, value: StaticValue<EffectType, Target>): EffectFactory<Target> =>
        (game, source, props) => new Container(game, source, props, new StaticEffect<EffectType, Target>(type, value));
    const dynamicEffect = <EffectType extends EffectName>(type: EffectType, value: DynamicValue<EffectValueMap[EffectType], Target>): EffectFactory<Target> =>
        (game, source, props) => new Container(game, source, props, new DynamicEffect<EffectType, Target>(type, value));
    return {
        static: staticEffect,
        dynamic: dynamicEffect,
        detached: <EffectType extends EffectName, State>(type: EffectType, value: DetachedValue<Target, State>): EffectFactory<Target> =>
            (game, source, props) => new Container(game, source, props, new DetachedEffect<EffectType, Target, State>(type, value)),
        flexible: <EffectType extends FlexibleEffectName>(type: EffectType, value: FlexibleValue<EffectValueMap[EffectType], Target>): EffectFactory<Target> =>
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
