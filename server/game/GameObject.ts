import { v1 as uuidV1 } from 'uuid';

import type { AbilityContext } from './AbilityContext.js';
import { EffectNames, Stages } from './Constants.js';
import type { CardEffect } from './Effects/types.js';
import type Game from './game.js';
import type { GameAction } from './GameActions/GameAction.js';
import * as GameActions from './GameActions/GameActions.js';
import type Player from './player.js';

export class GameObject {
    declare public game: Game;
    private _name!: string;
    public uuid = uuidV1();
    protected id: string;
    protected printedType = '';
    public facedown = false;
    private effects = [] as CardEffect[];
    private effectsByType = new Map<EffectNames, CardEffect[]>();
    private suppressEffectCount = 0;

    public constructor(
        game: Game,
        name: string
    ) {
        this.game = game;
        this.name = name;
        this.id = name;
    }

    public get type() {
        return this.getType();
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public addEffect(effect: CardEffect) {
        this.effects.push(effect);
        const bucket = this.effectsByType.get(effect.type);
        if(bucket) {
            bucket.push(effect);
        } else {
            this.effectsByType.set(effect.type, [effect]);
        }
        if(effect.type === EffectNames.SuppressEffects) {
            this.suppressEffectCount++;
        }
    }

    public removeEffect(effect: CardEffect) {
        if(effect.type === EffectNames.SuppressEffects) {
            this.suppressEffectCount--;
        }
        this.effects = this.effects.filter((e) => e !== effect);
        const bucket = this.effectsByType.get(effect.type);
        if(bucket) {
            const idx = bucket.indexOf(effect);
            if(idx !== -1) {
                bucket.splice(idx, 1);
            }
            if(bucket.length === 0) {
                this.effectsByType.delete(effect.type);
            }
        }
    }

    public getEffects<V = any>(type: EffectNames): V[] {
        // Fast path: no suppress effects — use indexed lookup
        if(this.suppressEffectCount === 0) {
            const bucket = this.effectsByType.get(type);
            if(!bucket || bucket.length === 0) {
                return [];
            }
            return bucket.map((effect) => effect.getValue(this));
        }
        // Slow path: suppress effects present — filter from raw effects
        let filteredEffects = this.getRawEffects().filter((effect) => effect.type === type);
        return filteredEffects.map((effect) => effect.getValue(this));
    }

    public sumEffects(type: EffectNames) {
        let filteredEffects = this.getEffects(type);
        return filteredEffects.reduce((total, effect) => total + effect, 0);
    }

    public anyEffect(type: EffectNames) {
        // Fast path: no suppress effects — check index directly
        if(this.suppressEffectCount === 0) {
            const bucket = this.effectsByType.get(type);
            return !!bucket && bucket.length > 0;
        }
        return this.getEffects(type).length > 0;
    }

    public allowGameAction(actionType: string, context = this.game.getFrameworkContext()) {
        const gameActionFactory = (GameActions as Record<string, (...args: any[]) => GameAction>)[actionType];
        if(gameActionFactory) {
            const gameAction: GameAction = gameActionFactory();
            return gameAction.canAffect(this, context);
        }
        return this.checkRestrictions(actionType, context);
    }

    public checkRestrictions(actionType: string, context?: AbilityContext) {
        return !this.getEffects(EffectNames.AbilityRestrictions).some((restriction) =>
            restriction.isMatch(actionType, context, this)
        );
    }

    public isUnique() {
        return false;
    }

    public getType() {
        if(this.anyEffect(EffectNames.ChangeType)) {
            return this.mostRecentEffect(EffectNames.ChangeType);
        }
        return this.printedType;
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

    public getShortSummary() {
        return {
            id: this.id,
            label: this.name,
            name: this.name,
            facedown: this.isFacedown(),
            type: this.getType(),
            uuid: this.uuid
        };
    }

    public canBeTargeted(context: AbilityContext, selectedCards: GameObject | GameObject[] = []) {
        if(!this.checkRestrictions('target', context)) {
            return false;
        }
        let targets = selectedCards;
        if(!Array.isArray(targets)) {
            targets = [targets];
        }

        targets = targets.concat(this);
        let targetingCost = context.player.getTargetingCost(context.source, targets);

        if(context.stage === Stages.PreTarget || context.stage === Stages.Cost) {
            //We haven't paid the cost yet, so figure out what it will cost to play this so we can know how much fate we'll have available for targeting
            let fateCost = 0;
            // @ts-expect-error -- getReducedCost exists on play action abilities but is not declared on the base AbilityContext.ability type
            if(context.ability.getReducedCost) {
                //we only want to consider the ability cost, not the card cost
                // @ts-expect-error -- getReducedCost exists on play action abilities but is not declared on the base AbilityContext.ability type
                fateCost = context.ability.getReducedCost(context);
            }
            let alternateFate = context.player.getAvailableAlternateFate(context.playType ?? '', context);
            let availableFate = Math.max(context.player.fate - Math.max(fateCost - alternateFate, 0), 0);

            return (
                availableFate >= targetingCost &&
                (targetingCost === 0 || context.player.checkRestrictions('spendFate', context))
            );
        } else if(context.stage === Stages.Target || context.stage === Stages.Effect) {
            //We paid costs first, or targeting has to be done after costs have been paid
            return (
                context.player.fate >= targetingCost &&
                (targetingCost === 0 || context.player.checkRestrictions('spendFate', context))
            );
        }

        return true;
    }

    public getShortSummaryForControls(_activePlayer: Player): Record<string, unknown> {
        return this.getShortSummary();
    }

    public isFacedown() {
        return this.facedown;
    }

    public isFaceup() {
        return !this.facedown;
    }

    public mostRecentEffect(type: EffectNames) {
        const effects = this.getEffects(type);
        return effects[effects.length - 1];
    }

    public getRawEffects() {
        // Fast path: no suppress effects (vast majority of game objects)
        if(this.suppressEffectCount === 0) {
            return this.effects;
        }
        const suppressEffects = this.effects.filter((effect) => effect.type === EffectNames.SuppressEffects);
        const suppressedEffects = suppressEffects.reduce<CardEffect[]>((array, effect) => array.concat(effect.getValue(this)), []);
        return this.effects.filter((effect) => !suppressedEffects.includes(effect));
    }
}
