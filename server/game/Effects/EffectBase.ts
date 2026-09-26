import { CardType, EffectName, Duration } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import type { GameObject } from '../GameObject.js';
import type { CardEffect } from './types.js';
import { isEffectOf } from './types.js';
import type { EffectValueMap } from './EffectValueMap.js';

const binaryCardEffects: readonly EffectName[] = [
    EffectName.Blank,
    EffectName.CanBeSeenWhenFacedown,
    EffectName.CannotParticipateAsAttacker,
    EffectName.CannotParticipateAsDefender,
    EffectName.AbilityRestrictions,
    EffectName.DoesNotBow,
    EffectName.DoesNotReady,
    EffectName.ShowTopConflictCard,
    EffectName.ShowTopDynastyCard
];

const MilitaryModifiers = [
    EffectName.ModifyBaseMilitarySkillMultiplier,
    EffectName.ModifyMilitarySkill,
    EffectName.ModifyMilitarySkillMultiplier,
    EffectName.ModifyBothSkills,
    EffectName.AttachmentMilitarySkillModifier
] as const;

const PoliticalModifiers = [
    EffectName.ModifyBasePoliticalSkillMultiplier,
    EffectName.ModifyPoliticalSkill,
    EffectName.ModifyPoliticalSkillMultiplier,
    EffectName.ModifyBothSkills,
    EffectName.AttachmentPoliticalSkillModifier
] as const;

const ProvinceStrengthModifiers = [
    EffectName.ModifyProvinceStrength,
    EffectName.ModifyProvinceStrengthMultiplier,
    EffectName.SetBaseProvinceStrength
] as const;

export type MilitaryModifierName = typeof MilitaryModifiers[number];
export type PoliticalModifierName = typeof PoliticalModifiers[number];
export type ProvinceStrengthModifierName = typeof ProvinceStrengthModifiers[number];

const hasDash: Partial<Record<string, (card: DrawCard, effect: EffectBase) => boolean>> = {
    modifyBaseMilitarySkillMultiplier: (card) => card.hasDash('military'),
    modifyBasePoliticalSkillMultiplier: (card) => card.hasDash('political'),
    modifyBothSkills: (card) => card.hasDash('military') && card.hasDash('political'),
    modifyMilitarySkill: (card) => card.hasDash('military'),
    attachmentMilitarySkillModifier: (card) => card.hasDash('military'),
    modifyMilitarySkillMultiplier: (card) => card.hasDash('military'),
    modifyPoliticalSkill: (card) => card.hasDash('political'),
    attachmentPoliticalSkillModifier: (card) => card.hasDash('political'),
    modifyPoliticalSkillMultiplier: (card) => card.hasDash('political'),
    setBaseMilitarySkill: (card) => card.hasDash('military'),
    setBasePoliticalSkill: (card) => card.hasDash('political'),
    setDash: (card, effect) => {
        const type = isEffectOf(effect, EffectName.SetDash) ? effect.getValue() : undefined;
        return !!type && card.hasDash(type);
    },
    setMilitarySkill: (card) => card.hasDash('military'),
    setPoliticalSkill: (card) => card.hasDash('political')
};

const conflictingEffects: Partial<Record<string, (target: GameObject, value?: unknown) => CardEffect[]>> = {
    modifyBaseMilitarySkillMultiplier: (card) =>
        card.getRawEffects().filter((effect) => effect.type === EffectName.SetBaseMilitarySkill),
    modifyBasePoliticalSkillMultiplier: (card) =>
        card.getRawEffects().filter((effect) => effect.type === EffectName.SetBasePoliticalSkill),
    modifyGlory: (card) => card.getRawEffects().filter((effect) => effect.type === EffectName.SetGlory),
    modifyMilitarySkill: (card) => card.getRawEffects().filter((effect) => effect.type === EffectName.SetMilitarySkill),
    modifyMilitarySkillMultiplier: (card) =>
        card.getRawEffects().filter((effect) => effect.type === EffectName.SetMilitarySkill),
    modifyPoliticalSkill: (card) => card.getRawEffects().filter((effect) => effect.type === EffectName.SetPoliticalSkill),
    modifyPoliticalSkillMultiplier: (card) =>
        card.getRawEffects().filter((effect) => effect.type === EffectName.SetPoliticalSkill),
    setBaseMilitarySkill: (card) => card.getRawEffects().filter((effect) => effect.type === EffectName.SetMilitarySkill),
    setBasePoliticalSkill: (card) => card.getRawEffects().filter((effect) => effect.type === EffectName.SetPoliticalSkill),
    setMaxConflicts: (player, value) => {
        if(player.mostRecentEffect(EffectName.SetMaxConflicts) !== value) {
            return [];
        }
        const last = player.getRawEffects().filter((effect) => effect.type === EffectName.SetMaxConflicts).at(-1);
        return last ? [last] : [];
    },
    takeControl: (card, player) => {
        if(card.mostRecentEffect(EffectName.TakeControl) !== player) {
            return [];
        }
        const last = card.getRawEffects().filter((effect) => effect.type === EffectName.TakeControl).at(-1);
        return last ? [last] : [];
    }
};

const durations: readonly (Duration | null | undefined)[] = [
    Duration.UntilEndOfDuel,
    Duration.UntilEndOfConflict,
    Duration.UntilEndOfPhase,
    Duration.UntilEndOfRound
];

/**
 * What an `Effect` applies to its targets. `N` is the effect's name, which decides its value
 * type; `T` is the kind of object the effect's builder targets.
 */
export abstract class EffectBase<N extends EffectName = EffectName, T extends GameObject = GameObject, V = EffectValueMap[N]> {
    type: N;
    context!: AbilityContext;
    duration?: Duration | null;
    isConditional?: boolean;
    abstract value: unknown;

    constructor(type: N) {
        this.type = type;
        this.duration = null;
    }

    abstract apply(target: T): void;

    abstract unapply(target: T): void;

    abstract getValue(target: GameObject): V;
    abstract getValue(): V | undefined;

    abstract setContext(context: AbilityContext): void;

    abstract getDebugInfo(): { type: EffectName; value: unknown };

    recalculate(_target: T): boolean {
        return false;
    }

    canBeApplied(target: BaseCard): boolean {
        if(target.facedown && target.type !== CardType.Province) {
            return false;
        }
        const dashCheck = hasDash[this.type];
        // only characters have dashes
        return !dashCheck || !target.isDrawCard() || !dashCheck(target, this);
    }

    isMilitaryModifier(): this is EffectBase<MilitaryModifierName> {
        return MilitaryModifiers.some((name) => name === this.type);
    }

    isPoliticalModifier(): this is EffectBase<PoliticalModifierName> {
        return PoliticalModifiers.some((name) => name === this.type);
    }

    isSkillModifier(): this is EffectBase<MilitaryModifierName | PoliticalModifierName> {
        return this.isMilitaryModifier() || this.isPoliticalModifier();
    }

    isProvinceStrengthModifier(): this is EffectBase<ProvinceStrengthModifierName> {
        return ProvinceStrengthModifiers.some((name) => name === this.type);
    }

    checkConflictingEffects(type: EffectName, target: GameObject): boolean {
        if(binaryCardEffects.includes(type)) {
            let matchingEffects = target.getRawEffects().filter((effect: CardEffect) => effect.type === type);
            return matchingEffects.every((effect: CardEffect) => this.hasLongerDuration(effect) || effect.isConditional);
        }
        const conflicting = conflictingEffects[type];
        if(conflicting) {
            let matchingEffects = conflicting(target, this.getValue());
            return matchingEffects.every((effect: CardEffect) => this.hasLongerDuration(effect) || effect.isConditional);
        }
        if(type === EffectName.ModifyBothSkills) {
            return (
                this.checkConflictingEffects(EffectName.ModifyMilitarySkill, target) ||
                this.checkConflictingEffects(EffectName.ModifyPoliticalSkill, target)
            );
        }
        if(type === EffectName.HonorStatusDoesNotModifySkill) {
            return (
                this.checkConflictingEffects(EffectName.ModifyMilitarySkill, target) ||
                this.checkConflictingEffects(EffectName.ModifyPoliticalSkill, target)
            );
        }
        if(type === EffectName.HonorStatusReverseModifySkill) {
            return (
                this.checkConflictingEffects(EffectName.ModifyMilitarySkill, target) ||
                this.checkConflictingEffects(EffectName.ModifyPoliticalSkill, target)
            );
        }
        return true;
    }

    hasLongerDuration(effect: CardEffect): boolean {
        return durations.indexOf(this.duration) > durations.indexOf(effect.duration);
    }
}
