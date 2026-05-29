import AbilityDsl from './abilitydsl.js';
import { GameObject } from './GameObject.js';
import { Locations, Durations } from './Constants.js';
import type Game from './Game.js';
import type Effect from './Effects/Effect.js';

type EffectFactory = (game: Game, source: any, properties: EffectProperties) => Effect;

interface EffectProperties {
    duration?: Durations;
    location?: Locations;
    effect?: EffectFactory | EffectFactory[];
    match?: any;
    condition?: () => boolean;
    [key: string]: any;
}

type PropertyFactory = (dsl: typeof AbilityDsl) => EffectProperties;

// This class is inherited by Ring and BaseCard and also represents Framework effects

class EffectSource extends GameObject {
    constructor(game: Game, name = 'Framework effect') {
        super(game, name);
    }

    private applyDurationEffect(duration: Durations, propertyFactory: PropertyFactory): void {
        const properties = propertyFactory(AbilityDsl);
        this.addEffectToEngine(Object.assign({ duration, location: Locations.Any }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the current
     * duel.
     */
    untilEndOfDuel(propertyFactory: PropertyFactory): void {
        this.applyDurationEffect(Durations.UntilEndOfDuel, propertyFactory);
    }

    /**
     * Applies an immediate effect which lasts until the end of the current
     * conflict.
     */
    untilEndOfConflict(propertyFactory: PropertyFactory): void {
        this.applyDurationEffect(Durations.UntilEndOfConflict, propertyFactory);
    }

    /**
     * Applies an immediate effect which lasts until the end of the phase.
     */
    untilEndOfPhase(propertyFactory: PropertyFactory): void {
        this.applyDurationEffect(Durations.UntilEndOfPhase, propertyFactory);
    }

    /**
     * Applies an immediate effect which lasts until the end of the round.
     */
    untilEndOfRound(propertyFactory: PropertyFactory): void {
        this.applyDurationEffect(Durations.UntilEndOfRound, propertyFactory);
    }

    untilPassPriority(propertyFactory: PropertyFactory): void {
        this.applyDurationEffect(Durations.UntilPassPriority, propertyFactory);
    }

    untilOpponentPassPriority(propertyFactory: PropertyFactory): void {
        this.applyDurationEffect(Durations.UntilOpponentPassPriority, propertyFactory);
    }

    untilNextPassPriority(propertyFactory: PropertyFactory): void {
        this.applyDurationEffect(Durations.UntilNextPassPriority, propertyFactory);
    }

    untilSelfPassPriority(propertyFactory: PropertyFactory): void {
        this.applyDurationEffect(Durations.UntilSelfPassPriority, propertyFactory);
    }

    /**
     * Applies a lasting effect which lasts until an event contained in the
     * `until` property for the effect has occurred.
     */
    lastingEffect(propertyFactory: PropertyFactory): void {
        this.applyDurationEffect(Durations.Custom, propertyFactory);
    }

    /*
     * Adds a persistent/lasting/delayed effect to the effect engine
     * @param {Object} properties - properties for the effect - see Effects/Effect.js
     */
    addEffectToEngine(properties: EffectProperties): Effect[] {
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

export default EffectSource;
