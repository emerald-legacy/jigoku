import { v1 as uuidV1 } from 'uuid';

import type { AbilityContext } from './AbilityContext.js';
import { type CardType, EffectName, Stage } from './Constants.js';
import type { CardEffect } from './Effects/types.js';
import type { EffectValueMap } from './Effects/EffectValueMap.js';
import type Game from './Game.js';
import type { GameAction } from './GameActions/GameAction.js';
import { getGameAction } from './GameActions/GameActionRegistry.js';
import type Player from './Player.js';

export interface ShortSummary {
    name: string;
    [key: string]: unknown;
}

export class GameObject {
    declare public game: Game;
    private _name!: string;
    public uuid = uuidV1();
    protected id: string;
    public printedType = '';
    public facedown = false;
    protected effects = [] as CardEffect[];
    protected effectsByType = new Map<EffectName, CardEffect[]>();
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
        if(effect.type === EffectName.SuppressEffects) {
            this.suppressEffectCount++;
        }
    }

    public removeEffect(effect: CardEffect) {
        if(effect.type === EffectName.SuppressEffects) {
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

    public getEffects<N extends EffectName>(type: N): EffectValueMap[N][] {
        // Fast path: no suppress effects — use indexed lookup
        if(this.suppressEffectCount === 0) {
            const bucket = this.effectsByType.get(type);
            if(!bucket || bucket.length === 0) {
                return [];
            }
            return bucket.map((effect) => effect.getValue<EffectValueMap[N]>(this));
        }
        // Slow path: suppress effects present — filter from raw effects
        let filteredEffects = this.getRawEffects().filter((effect) => effect.type === type);
        return filteredEffects.map((effect) => effect.getValue<EffectValueMap[N]>(this));
    }

    public sumEffects(type: EffectName): number {
        const filteredEffects = this.getEffects(type) as number[];
        return filteredEffects.reduce((total, effect) => total + effect, 0);
    }

    public anyEffect(type: EffectName) {
        // Fast path: no suppress effects — check index directly
        if(this.suppressEffectCount === 0) {
            const bucket = this.effectsByType.get(type);
            return !!bucket && bucket.length > 0;
        }
        return this.getEffects(type).length > 0;
    }

    public allowGameAction(actionType: string, context = this.game.getFrameworkContext()) {
        const gameActionFactory = getGameAction(actionType);
        if(gameActionFactory) {
            const gameAction: GameAction = gameActionFactory();
            return gameAction.canAffect(this, context);
        }
        return this.checkRestrictions(actionType, context);
    }

    public checkRestrictions(actionType: string, context?: AbilityContext) {
        return !this.getEffects(EffectName.AbilityRestrictions).some((restriction) =>
            restriction.isMatch(actionType, context as AbilityContext, this)
        );
    }

    public getType(): CardType | string {
        if(this.anyEffect(EffectName.ChangeType)) {
            return this.mostRecentEffect(EffectName.ChangeType);
        }
        return this.printedType;
    }

    public getShortSummary(): ShortSummary {
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

        if(context.stage === Stage.PreTarget || context.stage === Stage.Cost) {
            //We haven't paid the cost yet, so figure out what it will cost to play this so we can know how much fate we'll have available for targeting
            let fateCost = 0;
            // @ts-expect-error -- getReducedCost exists on play action abilities but is not declared on the base AbilityContext.ability type
            if(context.ability.getReducedCost) {
                //we only want to consider the ability cost, not the card cost
                // @ts-expect-error -- getReducedCost exists on play action abilities but is not declared on the base AbilityContext.ability type
                fateCost = context.ability.getReducedCost(context);
            }
            let alternateFate = context.player.getAvailableAlternateFate(context.playType, context);
            let availableFate = Math.max(context.player.fate - Math.max(fateCost - alternateFate, 0), 0);

            return (
                availableFate >= targetingCost &&
                (targetingCost === 0 || context.player.checkRestrictions('spendFate', context))
            );
        } else if(context.stage === Stage.Target || context.stage === Stage.Effect) {
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

    public mostRecentEffect<N extends EffectName>(type: N): EffectValueMap[N] {
        const effects = this.getEffects(type);
        return effects[effects.length - 1] as EffectValueMap[N];
    }

    public getRawEffects() {
        // Fast path: no suppress effects (vast majority of game objects)
        if(this.suppressEffectCount === 0) {
            return this.effects;
        }
        const suppressEffects = this.effects.filter((effect) => effect.type === EffectName.SuppressEffects);
        const suppressedEffects = suppressEffects.reduce<CardEffect[]>((array, effect) => array.concat(effect.getValue(this)), []);
        return this.effects.filter((effect) => !suppressedEffects.includes(effect));
    }

    // Copies this object's effect-tracking state onto a target (used by createSnapshot,
    // which bypasses the constructor). Keeps the private suppressEffectCount in sync —
    // hand-copying in subclasses could not reach it and silently dropped it.
    protected cloneEffectStateInto(target: GameObject): void {
        target.effects = [...this.effects];
        const clonedIndex = new Map<EffectName, CardEffect[]>();
        for(const [type, bucket] of this.effectsByType) {
            clonedIndex.set(type, [...bucket]);
        }
        target.effectsByType = clonedIndex;
        target.suppressEffectCount = this.suppressEffectCount;
    }
}
