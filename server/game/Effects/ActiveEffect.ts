import { Location, Duration } from '../Constants.js';
import type { EffectName, Players } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { BaseAbility } from '../BaseAbility.js';
import type { EffectSource } from '../EffectSource.js';
import type BaseCard from '../BaseCard.js';
import type Game from '../Game.js';
import type { GameObject } from '../GameObject.js';
import type { EventName } from '../Constants.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { EffectApplier } from './EffectApplier.js';
import type Player from '../Player.js';
import type { TargetLocation } from '../Interfaces.js';

// Method syntax on purpose: a match function may take a narrower target type than its effect's targets.
interface Matcher<Value> {
    match(target: Value, context?: AbilityContext): boolean;
}
export type EffectMatchFn<Target extends GameObject = GameObject> = Matcher<Target>['match'];
export type EffectMatch<Target extends GameObject = GameObject> = EffectMatchFn<Target> | Target;

// Method syntax on purpose: cards narrow the event type.
interface UntilCallback<EventType extends EventName> {
    ends(event: GameEvent<EventType>): unknown;
}
/** Ends a custom-duration effect when one of these events happens and its callback returns true. */
export type EffectUntil = { [EventType in EventName]?: UntilCallback<EventType>['ends'] };

export interface EffectProperties<Target extends GameObject = GameObject> {
    match?: EffectMatch<Target>;
    duration?: Duration;
    until?: EffectUntil;
    condition?: (context: AbilityContext) => boolean;
    location?: Location;
    canChangeZoneOnce?: boolean;
    canChangeZoneNTimes?: number;
    ability?: BaseAbility;
    endingMessage?: string;
    // a player, or which players relative to the source's controller
    targetController?: Players | Player;
    targetLocation?: TargetLocation;
    target?: GameObject | GameObject[];
    /** A printed attachment skill bonus: not a card effect, so restrictions on card effects (Reclusive Zokujin's immunity) don't stop it. */
    printedSkillBonus?: boolean;
    /** Whose effect it is when the source has no controller (a ring or the framework): the player whose ability created it. */
    controller?: Player;
}

/**
 * An effect while it is active: which targets it reaches, for how long and under what condition (`EffectProperties`);
 * its `effect` (an `EffectApplier`) applies it to each of them.
 */
export class ActiveEffect<Target extends GameObject = GameObject> {
    game: Game;
    source: EffectSource;
    match: EffectMatch<Target>;
    duration: Duration | undefined;
    until: EffectUntil;
    condition: (context: AbilityContext) => boolean;
    location: Location;
    canChangeZoneOnce: boolean;
    canChangeZoneNTimes: number;
    effect: EffectApplier<EffectName, Target>;
    ability: BaseAbility | undefined;
    targets: Target[];
    context!: AbilityContext;
    endingMessage: string | undefined;
    creator: Player | undefined;

    constructor(game: Game, source: EffectSource, properties: EffectProperties<Target>, effect: EffectApplier<EffectName, Target>) {
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
        this.creator = properties.controller;
        this.targets = [];
        this.refreshContext();
        this.effect.duration = this.duration;
        this.endingMessage = properties.endingMessage || undefined;
    }

    refreshContext() {
        const controller = this.source.getEffectController() ?? this.creator;
        if(!controller) {
            throw new Error(`An effect from ${this.source.name} has no controller: pass the creating player as \`controller\``);
        }
        this.context = this.game.getFrameworkContext(controller);
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- an effect's source need not be a card (framework context)
        this.context.source = this.source as BaseCard;
        if(this.ability) {
            this.context.ability = this.ability;
        }
        this.effect.setContext(this.context);
    }

    isValidTarget(_target: Target): boolean {
        return true;
    }

    getTargets(_matchFn: EffectMatchFn<Target>): Target[] {
        return [];
    }

    addTarget(target: Target) {
        this.targets.push(target);
        this.effect.apply(target);
    }

    removeTargets(targets: Target[]) {
        targets.forEach((target) => this.effect.unapply(target));
        this.targets = this.targets.filter((t) => !targets.includes(t));
    }

    cancel() {
        this.targets.forEach((target) => this.effect.unapply(target));
        this.targets = [];
    }

    isEffectActive(): boolean {
        if(this.duration !== Duration.Persistent) {
            return true;
        }
        const effectOnSource = this.source.getPersistentEffectRecords().some((effect) => effect.ref && effect.ref.includes(this));
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
            const invalidTargets = this.targets.filter((target) => !matchFn(target, this.context) || !this.isValidTarget(target));
            // Remove invalid targets
            this.removeTargets(invalidTargets);
            stateChanged = stateChanged || invalidTargets.length > 0;
            // Recalculate the effect for valid targets
            this.targets.forEach((target) => stateChanged = this.effect.recalculate(target) || stateChanged);
            // Check for new targets
            const newTargets = this.getTargets(matchFn).filter((target) => !this.targets.includes(target) && this.isValidTarget(target));
            // Apply the effect to new targets
            newTargets.forEach((target) => this.addTarget(target));
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
            targets: this.targets.map((target) => target.name).join(','),
            active: this.isEffectActive(),
            condition: this.condition(this.context),
            effect: this.effect.getDebugInfo()
        };
    }
}

