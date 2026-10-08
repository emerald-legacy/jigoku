import { GameObject } from './GameObject.js';
import { Location, Duration } from './Constants.js';
import type Game from './Game.js';
import type Player from './Player.js';
import type { Effect } from './Effects/Effect.js';
import type { EffectFactory, EffectTarget } from './Effects/EffectBuilder.js';
import type { EffectProperties } from './Effects/Effect.js';

type EffectSourceProperties = EffectProperties<EffectTarget> & { effect?: EffectFactory | EffectFactory[] };

// This class is inherited by Ring and BaseCard and also represents Framework effects

export class EffectSource extends GameObject {
    constructor(game: Game, name = 'Framework effect') {
        super(game, name);
    }

    // Card-descriptor defaults shared by cards/rings/tokens (all EffectSources).
    // BaseCard overrides them with real implementations; non-card EffectSources
    // (Ring/StatusToken/ElementSymbol) inherit these null-object defaults.
    public isUnique() {
        return false;
    }

    public getPrintedFaction(): string | null {
        return null;
    }

    public hasKeyword(_keyword: string) {
        return false;
    }

    public hasTrait(_trait: string) {
        return false;
    }

    public getTraits(): Set<string> {
        return new Set();
    }

    public isFaction(_faction: string) {
        return false;
    }

    public hasToken(_type: string) {
        return false;
    }

    public isTemptationsMaho() {
        return false;
    }

    // What the effect engine reads off a source. Subclasses hold these in incompatible forms
    // (controller is a field on BaseCard but a getter on StatusToken), so they override methods.

    /** The player whose effects these are; framework effects, rings and element symbols have none. */
    public getEffectController(): Player | undefined {
        return undefined;
    }

    public getPersistentEffectRecords(): readonly { ref?: Effect[] }[] {
        return [];
    }

    public applyDurationEffect(duration: Duration, properties: EffectSourceProperties): void {
        this.addEffectToEngine(Object.assign({ duration, location: Location.Any }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the current
     * duel.
     */
    untilEndOfDuel(properties: EffectSourceProperties): void {
        this.applyDurationEffect(Duration.UntilEndOfDuel, properties);
    }

    /**
     * Applies an immediate effect which lasts until the end of the current
     * conflict.
     */
    untilEndOfConflict(properties: EffectSourceProperties): void {
        this.applyDurationEffect(Duration.UntilEndOfConflict, properties);
    }

    /**
     * Applies an immediate effect which lasts until the end of the phase.
     */
    untilEndOfPhase(properties: EffectSourceProperties): void {
        this.applyDurationEffect(Duration.UntilEndOfPhase, properties);
    }

    /**
     * Applies an immediate effect which lasts until the end of the round.
     */
    untilEndOfRound(properties: EffectSourceProperties): void {
        this.applyDurationEffect(Duration.UntilEndOfRound, properties);
    }

    untilPassPriority(properties: EffectSourceProperties): void {
        this.applyDurationEffect(Duration.UntilPassPriority, properties);
    }

    untilOpponentPassPriority(properties: EffectSourceProperties): void {
        this.applyDurationEffect(Duration.UntilOpponentPassPriority, properties);
    }

    untilNextPassPriority(properties: EffectSourceProperties): void {
        this.applyDurationEffect(Duration.UntilNextPassPriority, properties);
    }

    untilSelfPassPriority(properties: EffectSourceProperties): void {
        this.applyDurationEffect(Duration.UntilSelfPassPriority, properties);
    }

    /**
     * Applies a lasting effect which lasts until an event contained in the
     * `until` property for the effect has occurred.
     */
    lastingEffect(properties: EffectSourceProperties): void {
        this.applyDurationEffect(Duration.Custom, properties);
    }

    /*
     * Adds a persistent/lasting/delayed effect to the effect engine
     * @param {Object} properties - properties for the effect - see Effects/Effect.js
     */
    addEffectToEngine(properties: EffectSourceProperties): Effect[] {
        const { effect, ...rest } = properties;
        if(Array.isArray(effect)) {
            return effect.map((factory) => this.game.effectEngine.add(factory(this.game, this, rest)));
        }
        if(effect) {
            return [this.game.effectEngine.add(effect(this.game, this, rest))];
        }
        return [];
    }

    removeEffectFromEngine(effectArray: Effect[]): void {
        this.game.effectEngine.unapplyAndRemove((effect: Effect) => effectArray.includes(effect));
    }

    removeLastingEffects(): void {
        this.game.effectEngine.removeLastingEffects(this);
    }
}

