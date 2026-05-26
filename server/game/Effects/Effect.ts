import { Locations, Durations } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseAbility from '../baseability.js';
import type BaseCard from '../basecard.js';
import type Game from '../game.js';
import type { GameObject } from '../GameObject.js';
import type StaticEffect from './StaticEffect.js';

export type EffectMatchFn = (target: GameObject, context?: AbilityContext) => boolean;
type EffectMatch = EffectMatchFn | GameObject;

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
class Effect {
    game: Game;
    source: BaseCard;
    match: EffectMatch;
    duration: Durations;
    until: Record<string, (...args: unknown[]) => boolean>;
    condition: (context: AbilityContext) => boolean;
    location: string;
    canChangeZoneOnce: boolean;
    canChangeZoneNTimes: number;
    effect: StaticEffect;
    ability: BaseAbility | undefined;
    targets: GameObject[];
    context!: AbilityContext;
    endingMessage: string | undefined;

    constructor(game: Game, source: BaseCard, properties: any, effect: StaticEffect) {
        this.game = game;
        this.source = source;
        this.match = properties.match || (() => true);
        this.duration = properties.duration;
        this.until = properties.until || {};
        this.condition = properties.condition || (() => true);
        this.location = properties.location || Locations.PlayArea;
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
        this.context = this.game.getFrameworkContext(this.source.controller);
        this.context.source = this.source;
        if(this.ability) {
            this.context.ability = this.ability;
        }
        this.effect.setContext(this.context);
    }

    isValidTarget(_target: any): boolean {
        return true;
    }

    getDefaultTarget(_context: any): any {
        return null;
    }

    getTargets(): any[] {
        return [];
    }

    addTarget(target: any) {
        this.targets.push(target);
        this.effect.apply(target);
    }

    removeTarget(target: any) {
        this.removeTargets([target]);
    }

    removeTargets(targets: any[]) {
        targets.forEach(target => this.effect.unapply(target));
        this.targets = this.targets.filter(t => !targets.includes(t));
    }

    hasTarget(target: any): boolean {
        return this.targets.includes(target);
    }

    cancel() {
        this.targets.forEach(target => this.effect.unapply(target));
        this.targets = [];
    }

    isEffectActive(): boolean {
        if(this.duration !== Durations.Persistent) {
            return true;
        }
        let effectOnSource = this.source.persistentEffects.some((effect: { ref?: Effect[] }) => effect.ref && effect.ref.includes(this));
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
            let newTargets = this.getTargets().filter(target => !this.targets.includes(target) && this.isValidTarget(target));
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
