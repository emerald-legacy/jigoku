import { EffectValue } from './EffectValue.js';
import { CardTypes, EffectNames, Durations, AbilityTypes } from '../Constants.js';
import GainAbility from './GainAbility.js';
import type DrawCard from '../DrawCard.js';
import type { GameObject } from '../GameObject.js';
import type { CardEffect } from './types.js';

const binaryCardEffects: readonly EffectNames[] = [
    EffectNames.Blank,
    EffectNames.CanBeSeenWhenFacedown,
    EffectNames.CannotParticipateAsAttacker,
    EffectNames.CannotParticipateAsDefender,
    EffectNames.AbilityRestrictions,
    EffectNames.DoesNotBow,
    EffectNames.DoesNotReady,
    EffectNames.ShowTopConflictCard,
    EffectNames.ShowTopDynastyCard
];

const MilitaryModifiers = [
    EffectNames.ModifyBaseMilitarySkillMultiplier,
    EffectNames.ModifyMilitarySkill,
    EffectNames.ModifyMilitarySkillMultiplier,
    EffectNames.ModifyBothSkills,
    EffectNames.AttachmentMilitarySkillModifier
];

const PoliticalModifiers = [
    EffectNames.ModifyBasePoliticalSkillMultiplier,
    EffectNames.ModifyPoliticalSkill,
    EffectNames.ModifyPoliticalSkillMultiplier,
    EffectNames.ModifyBothSkills,
    EffectNames.AttachmentPoliticalSkillModifier
];

const ProvinceStrengthModifiers = [
    EffectNames.ModifyProvinceStrength,
    EffectNames.ModifyProvinceStrengthMultiplier,
    EffectNames.SetBaseProvinceStrength
];

type DashSkillType = 'military' | 'political';

const hasDash: Record<string, (card: DrawCard, value?: EffectValue<unknown>) => boolean> = {
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
    setDash: (card, value) => {
        const type = value?.getValue() as DashSkillType | undefined;
        return !!type && card.hasDash(type);
    },
    setMilitarySkill: (card) => card.hasDash('military'),
    setPoliticalSkill: (card) => card.hasDash('political')
};

const conflictingEffects: Record<string, (target: GameObject, value?: unknown) => CardEffect[]> = {
    modifyBaseMilitarySkillMultiplier: (card) =>
        card.getRawEffects().filter((effect) => effect.type === EffectNames.SetBaseMilitarySkill),
    modifyBasePoliticalSkillMultiplier: (card) =>
        card.getRawEffects().filter((effect) => effect.type === EffectNames.SetBasePoliticalSkill),
    modifyGlory: (card) => card.getRawEffects().filter((effect) => effect.type === EffectNames.SetGlory),
    modifyMilitarySkill: (card) => card.getRawEffects().filter((effect) => effect.type === EffectNames.SetMilitarySkill),
    modifyMilitarySkillMultiplier: (card) =>
        card.getRawEffects().filter((effect) => effect.type === EffectNames.SetMilitarySkill),
    modifyPoliticalSkill: (card) => card.getRawEffects().filter((effect) => effect.type === EffectNames.SetPoliticalSkill),
    modifyPoliticalSkillMultiplier: (card) =>
        card.getRawEffects().filter((effect) => effect.type === EffectNames.SetPoliticalSkill),
    setBaseMilitarySkill: (card) => card.getRawEffects().filter((effect) => effect.type === EffectNames.SetMilitarySkill),
    setBasePoliticalSkill: (card) => card.getRawEffects().filter((effect) => effect.type === EffectNames.SetPoliticalSkill),
    setMaxConflicts: (player, value) => {
        if(player.mostRecentEffect(EffectNames.SetMaxConflicts) !== value) {
            return [];
        }
        const last = player.getRawEffects().filter((effect) => effect.type === EffectNames.SetMaxConflicts).at(-1);
        return last ? [last] : [];
    },
    takeControl: (card, player) => {
        if(card.mostRecentEffect(EffectNames.TakeControl) !== player) {
            return [];
        }
        const last = card.getRawEffects().filter((effect) => effect.type === EffectNames.TakeControl).at(-1);
        return last ? [last] : [];
    }
};

class StaticEffect {
    type: EffectNames;
    value: EffectValue<any>;
    context: any;
    duration: Durations | null;
    copies: GainAbility[];
    isConditional?: boolean;

    constructor(type: EffectNames, value: any) {
        this.type = type;
        if(value instanceof EffectValue) {
            this.value = value;
        } else {
            this.value = new EffectValue(value);
        }
        this.value.reset();
        this.context = null;
        this.duration = null;
        this.copies = [];
    }

    apply(target: GameObject) {
        target.addEffect(this);
        if(this.value instanceof GainAbility && this.value.abilityType === AbilityTypes.Persistent) {
            const copy = this.value.getCopy();
            copy.apply(target);
            this.copies.push(copy);
        } else {
            this.value.apply(target);
        }
    }

    unapply(target: GameObject) {
        target.removeEffect(this);
        this.value.unapply(target);
        this.copies.forEach((a) => a.unapply(target));
        this.copies = [];
    }

    getValue() {
        return this.value.getValue();
    }

    recalculate(_target?: unknown) {
        return this.value.recalculate();
    }

    setContext(context: any) {
        this.context = context;
        this.value.setContext(context);
    }

    canBeApplied(target: GameObject): boolean {
        if(target.facedown && target.type !== CardTypes.Province) {
            return false;
        }
        return !hasDash[this.type] || !hasDash[this.type](target as DrawCard, this.value);
    }

    isMilitaryModifier(): boolean {
        return MilitaryModifiers.includes(this.type);
    }

    isPoliticalModifier(): boolean {
        return PoliticalModifiers.includes(this.type);
    }

    isSkillModifier(): boolean {
        return this.isMilitaryModifier() || this.isPoliticalModifier();
    }

    isProvinceStrengthModifier(): boolean {
        return ProvinceStrengthModifiers.includes(this.type);
    }

    checkConflictingEffects(type: EffectNames, target: any): boolean {
        if(binaryCardEffects.includes(type)) {
            let matchingEffects = target.effects.filter((effect: any) => effect.type === type);
            return matchingEffects.every((effect: any) => this.hasLongerDuration(effect) || effect.isConditional);
        }
        if(conflictingEffects[type]) {
            let matchingEffects = conflictingEffects[type](target, this.getValue());
            return matchingEffects.every((effect: any) => this.hasLongerDuration(effect) || effect.isConditional);
        }
        if(type === EffectNames.ModifyBothSkills) {
            return (
                this.checkConflictingEffects(EffectNames.ModifyMilitarySkill, target) ||
                this.checkConflictingEffects(EffectNames.ModifyPoliticalSkill, target)
            );
        }
        if(type === EffectNames.HonorStatusDoesNotModifySkill) {
            return (
                this.checkConflictingEffects(EffectNames.ModifyMilitarySkill, target) ||
                this.checkConflictingEffects(EffectNames.ModifyPoliticalSkill, target)
            );
        }
        if(type === EffectNames.HonorStatusReverseModifySkill) {
            return (
                this.checkConflictingEffects(EffectNames.ModifyMilitarySkill, target) ||
                this.checkConflictingEffects(EffectNames.ModifyPoliticalSkill, target)
            );
        }
        return true;
    }

    hasLongerDuration(effect: CardEffect): boolean {
        let durations = [
            Durations.UntilEndOfDuel,
            Durations.UntilEndOfConflict,
            Durations.UntilEndOfPhase,
            Durations.UntilEndOfRound
        ];
        return durations.indexOf(this.duration as Durations) > durations.indexOf(effect.duration as Durations);
    }

    getDebugInfo() {
        return {
            type: this.type,
            value: this.value
        };
    }
}

export default StaticEffect;
