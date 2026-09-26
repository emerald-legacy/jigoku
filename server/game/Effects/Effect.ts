import { Location, Duration } from '../Constants.js';
import type { EffectName } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseAbility from '../BaseAbility.js';
import type EffectSource from '../EffectSource.js';
import type { SourceWithState } from '../EffectSource.js';
import type BaseCard from '../BaseCard.js';
import type Game from '../Game.js';
import type { GameObject } from '../GameObject.js';
import type { EventName } from '../Constants.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { EffectBase } from './EffectBase.js';
import type Player from '../Player.js';

// Method syntax on purpose: a match function may take a narrower target type than its effect's targets.
interface Matcher<T> {
    match(target: T, context?: AbilityContext): boolean;
}
export type EffectMatchFn<T extends GameObject = GameObject> = Matcher<T>['match'];
export type EffectMatch<T extends GameObject = GameObject> = EffectMatchFn<T> | T;

// Method syntax on purpose: cards narrow the event type.
interface UntilCallback<N extends EventName> {
    ends(event: GameEvent<N>): unknown;
}
/** Ends a custom-duration effect when one of these events happens and its callback returns true. */
export type EffectUntil = { [N in EventName]?: UntilCallback<N>['ends'] };

export interface EffectProperties<T extends GameObject = GameObject> {
    match?: EffectMatch<T>;
    duration?: Duration;
    until?: EffectUntil;
    condition?: (context: AbilityContext) => boolean;
    location?: string;
    canChangeZoneOnce?: boolean;
    canChangeZoneNTimes?: number;
    ability?: BaseAbility;
    endingMessage?: string;
    // a player, or which players relative to the source's controller
    targetController?: string | Player;
    targetLocation?: Location | Location[];
    target?: GameObject | GameObject[];
    [key: string]: unknown;
}

/**
 * Represents a card based effect applied to one or more targets.
 *
 * Properties:
 * match            - function that takes a card/player/ring and context object
 *                    and returns a boolean about whether the passed object should
 *                    have the effect applied. Alternatively, a card/player/ring can
 *                    be passed as the match property to match that single object.
 *                    Doesn't apply to conflict effects.
 * duration         - string representing how long the effect lasts.
 * condition        - function that returns a boolean determining whether the
 *                    effect can be applied. Use with cards that have a
 *                    condition that must be met before applying a persistent
 *                    effect (e.g. "during a conflict").
 * location         - location where the source of this effect needs to be for
 *                    the effect to be active. Defaults to 'play area'.
 * targetController - string that determines which player's cards are targeted.
 *                    Can be 'self' (default), 'opponent' or 'any'. For player
 *                    effects it determines which player(s) are affected.
 * targetLocation   - string that determines the location of cards that can be
 *                    applied by the effect. Can be 'play area' (default),
 *                    'province', or a specific location (e.g. 'stronghold province'
 *                    or 'hand'). This has no effect if a specific card is passed
 *                    to match.  Card effects only.
 * effect           - object representing the effect to be applied.
 */
class Effect<T extends GameObject = GameObject> {
    game: Game;
    source: EffectSource;
    match: EffectMatch<T>;
    duration: Duration | undefined;
    until: EffectUntil;
    condition: (context: AbilityContext) => boolean;
    location: string;
    canChangeZoneOnce: boolean;
    canChangeZoneNTimes: number;
    effect: EffectBase<EffectName, T>;
    ability: BaseAbility | undefined;
    targets: T[];
    context!: AbilityContext;
    endingMessage: string | undefined;

    constructor(game: Game, source: EffectSource, properties: EffectProperties<T>, effect: EffectBase<EffectName, T>) {
        this.game = game;
        this.source = source;
        this.match = properties.match || (() => true);
        this.duration = properties.duration;
        this.until = properties.until || {};
        this.condition = properties.condition || (() => true);
        this.location = properties.location || Location.PlayArea;
        this.canChangeZoneOnce = !!properties.canChangeZoneOnce;
        this.canChangeZoneNTimes = properties.canChangeZoneNTimes || 0;
        this.effect = effect;
        this.ability = properties.ability;
        this.targets = [];
        this.refreshContext();
        this.effect.duration = this.duration;
        this.effect.isConditional = !!properties.condition;
        this.endingMessage = properties.endingMessage || undefined;
    }

    refreshContext() {
        this.context = this.game.getFrameworkContext((this.source as SourceWithState).controller ?? null);
        this.context.source = this.source as BaseCard;
        if(this.ability) {
            this.context.ability = this.ability;
        }
        this.effect.setContext(this.context);
    }

    isValidTarget(_target: T): boolean {
        return true;
    }

    getTargets(_matchFn: EffectMatchFn<T>): T[] {
        return [];
    }

    addTarget(target: T) {
        this.targets.push(target);
        this.effect.apply(target);
    }

    removeTargets(targets: T[]) {
        targets.forEach(target => this.effect.unapply(target));
        this.targets = this.targets.filter(t => !targets.includes(t));
    }

    cancel() {
        this.targets.forEach(target => this.effect.unapply(target));
        this.targets = [];
    }

    isEffectActive(): boolean {
        if(this.duration !== Duration.Persistent) {
            return true;
        }
        let effectOnSource = (this.source as SourceWithState).persistentEffects?.some((effect) => effect.ref && effect.ref.includes(this)) ?? false;
        return !this.source.facedown && effectOnSource;
    }

    checkCondition(stateChanged: boolean): boolean {
        if(!this.condition(this.context) || !this.isEffectActive()) {
            stateChanged = this.targets.length > 0 || stateChanged;
            this.cancel();
            return stateChanged;
        } else if(typeof this.match === 'function') {
            const matchFn = this.match;
            // Get any targets which are no longer valid
            let invalidTargets = this.targets.filter(target => !matchFn(target, this.context) || !this.isValidTarget(target));
            // Remove invalid targets
            this.removeTargets(invalidTargets);
            stateChanged = stateChanged || invalidTargets.length > 0;
            // Recalculate the effect for valid targets
            this.targets.forEach(target => stateChanged = this.effect.recalculate(target) || stateChanged);
            // Check for new targets
            let newTargets = this.getTargets(matchFn).filter(target => !this.targets.includes(target) && this.isValidTarget(target));
            // Apply the effect to new targets
            newTargets.forEach(target => this.addTarget(target));
            return stateChanged || newTargets.length > 0;
        } else if(this.targets.includes(this.match)) {
            if(!this.isValidTarget(this.match)) {
                this.cancel();
                return true;
            }
            return this.effect.recalculate(this.match) || stateChanged;
        } else if(!this.targets.includes(this.match) && this.isValidTarget(this.match)) {
            this.addTarget(this.match);
            return true;
        }
        return stateChanged;
    }

    getDebugInfo() {
        return {
            source: this.source.name,
            targets: this.targets.map(target => target.name).join(','),
            active: this.isEffectActive(),
            condition: this.condition(this.context),
            effect: this.effect.getDebugInfo()
        };
    }
}

export default Effect;
