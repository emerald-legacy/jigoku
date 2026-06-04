import { EffectValue } from './EffectValue.js';
import { CardType, EffectName, Duration, AbilityType } from '../Constants.js';
import GainAbility from './GainAbility.js';
import type { AbilityContext } from '../AbilityContext.js';
import type DrawCard from '../DrawCard.js';
import type { GameObject } from '../GameObject.js';
import type { CardEffect } from './types.js';

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
];

const PoliticalModifiers = [
    EffectName.ModifyBasePoliticalSkillMultiplier,
    EffectName.ModifyPoliticalSkill,
    EffectName.ModifyPoliticalSkillMultiplier,
    EffectName.ModifyBothSkills,
    EffectName.AttachmentPoliticalSkillModifier
];

const ProvinceStrengthModifiers = [
    EffectName.ModifyProvinceStrength,
    EffectName.ModifyProvinceStrengthMultiplier,
    EffectName.SetBaseProvinceStrength
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

class StaticEffect implements CardEffect {
    type: EffectName;
    value: EffectValue<unknown>;
    context!: AbilityContext;
    duration: Duration | null;
    copies: Map<string, GainAbility>;
    isConditional?: boolean;

    constructor(type: EffectName, value: unknown) {
        this.type = type;
        if(value instanceof EffectValue) {
            this.value = value;
        } else {
            this.value = new EffectValue(value);
        }
        this.value.reset();
        this.duration = null;
        this.copies = new Map();
    }

    apply(target: GameObject) {
        target.addEffect(this);
        if(this.value instanceof GainAbility && this.value.abilityType === AbilityType.Persistent) {
            const copy = this.value.getCopy();
            copy.apply(target as DrawCard);
            this.copies.set(target.uuid, copy);
        } else {
            this.value.apply(target);
        }
    }

    unapply(target: GameObject) {
        target.removeEffect(this);
        const copy = this.copies.get(target.uuid);
        if(copy) {
            copy.unapply(target as DrawCard);
            this.copies.delete(target.uuid);
        } else {
            this.value.unapply(target);
        }
    }

    getValue<T = unknown>(_target?: GameObject): T {
        return this.value.getValue() as T;
    }

    recalculate(_target?: unknown) {
        return this.value.recalculate();
    }

    setContext(context: AbilityContext) {
        this.context = context;
        this.value.setContext(context);
    }

    canBeApplied(target: GameObject): boolean {
        if(target.facedown && target.type !== CardType.Province) {
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

    checkConflictingEffects(type: EffectName, target: any): boolean {
        if(binaryCardEffects.includes(type)) {
            let matchingEffects = target.effects.filter((effect: CardEffect) => effect.type === type);
            return matchingEffects.every((effect: CardEffect) => this.hasLongerDuration(effect) || effect.isConditional);
        }
        if(conflictingEffects[type]) {
            let matchingEffects = conflictingEffects[type](target, this.getValue());
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
        let durations = [
            Duration.UntilEndOfDuel,
            Duration.UntilEndOfConflict,
            Duration.UntilEndOfPhase,
            Duration.UntilEndOfRound
        ];
        return durations.indexOf(this.duration as Duration) > durations.indexOf(effect.duration as Duration);
    }

    getDebugInfo() {
        return {
            type: this.type,
            value: this.value
        };
    }
}

export default StaticEffect;
