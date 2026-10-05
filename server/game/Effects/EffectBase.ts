import { CardType, EffectName, Duration } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import type { GameObject } from '../GameObject.js';
import { isEffectOf } from './types.js';
import type { EffectValueMap } from './EffectValueMap.js';

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

type MilitaryModifierName = typeof MilitaryModifiers[number];
type PoliticalModifierName = typeof PoliticalModifiers[number];
type ProvinceStrengthModifierName = typeof ProvinceStrengthModifiers[number];

const hasDash: Partial<Record<EffectName, (card: DrawCard, effect: EffectBase<EffectName, GameObject, unknown>) => boolean>> = {
    [EffectName.ModifyBaseMilitarySkillMultiplier]: (card) => card.hasDash('military'),
    [EffectName.ModifyBasePoliticalSkillMultiplier]: (card) => card.hasDash('political'),
    [EffectName.ModifyBothSkills]: (card) => card.hasDash('military') && card.hasDash('political'),
    [EffectName.ModifyMilitarySkill]: (card) => card.hasDash('military'),
    [EffectName.AttachmentMilitarySkillModifier]: (card) => card.hasDash('military'),
    [EffectName.ModifyMilitarySkillMultiplier]: (card) => card.hasDash('military'),
    [EffectName.ModifyPoliticalSkill]: (card) => card.hasDash('political'),
    [EffectName.AttachmentPoliticalSkillModifier]: (card) => card.hasDash('political'),
    [EffectName.ModifyPoliticalSkillMultiplier]: (card) => card.hasDash('political'),
    [EffectName.SetBaseMilitarySkill]: (card) => card.hasDash('military'),
    [EffectName.SetBasePoliticalSkill]: (card) => card.hasDash('political'),
    [EffectName.SetDash]: (card, effect) => {
        const type = isEffectOf(effect, EffectName.SetDash) ? effect.getValue() : undefined;
        return !!type && card.hasDash(type);
    },
    [EffectName.SetMilitarySkill]: (card) => card.hasDash('military'),
    [EffectName.SetPoliticalSkill]: (card) => card.hasDash('political')
};

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

    getDebugInfo(): { type: EffectName; value: unknown } {
        return {
            type: this.type,
            value: this.value
        };
    }

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
}
