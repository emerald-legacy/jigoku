import { CardType, EffectName, type Duration, SkillType } from '../Constants.js';
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

type MilitaryModifierName = typeof MilitaryModifiers[number];
type PoliticalModifierName = typeof PoliticalModifiers[number];

const hasDash: Partial<Record<EffectName, (card: DrawCard, effect: EffectApplier<EffectName, GameObject, unknown>) => boolean>> = {
    [EffectName.ModifyBaseMilitarySkillMultiplier]: (card) => card.hasDash(SkillType.Military),
    [EffectName.ModifyBasePoliticalSkillMultiplier]: (card) => card.hasDash(SkillType.Political),
    [EffectName.ModifyBothSkills]: (card) => card.hasDash(SkillType.Military) && card.hasDash(SkillType.Political),
    [EffectName.ModifyMilitarySkill]: (card) => card.hasDash(SkillType.Military),
    [EffectName.AttachmentMilitarySkillModifier]: (card) => card.hasDash(SkillType.Military),
    [EffectName.ModifyMilitarySkillMultiplier]: (card) => card.hasDash(SkillType.Military),
    [EffectName.ModifyPoliticalSkill]: (card) => card.hasDash(SkillType.Political),
    [EffectName.AttachmentPoliticalSkillModifier]: (card) => card.hasDash(SkillType.Political),
    [EffectName.ModifyPoliticalSkillMultiplier]: (card) => card.hasDash(SkillType.Political),
    [EffectName.SetBaseMilitarySkill]: (card) => card.hasDash(SkillType.Military),
    [EffectName.SetBasePoliticalSkill]: (card) => card.hasDash(SkillType.Political),
    [EffectName.SetDash]: (card, effect) => {
        const type = isEffectOf(effect, EffectName.SetDash) ? effect.getValue() : undefined;
        return !!type && card.hasDash(type);
    },
    [EffectName.SetMilitarySkill]: (card) => card.hasDash(SkillType.Military),
    [EffectName.SetPoliticalSkill]: (card) => card.hasDash(SkillType.Political)
};

/**
 * What an `ActiveEffect` applies to its targets. `EffectType` is the effect's name, which decides its value
 * type; `Target` is the kind of object the effect's builder targets.
 */
export abstract class EffectApplier<EffectType extends EffectName = EffectName, Target extends GameObject = GameObject, Value = EffectValueMap[EffectType]> {
    type: EffectType;
    context!: AbilityContext;
    duration?: Duration | null;
    abstract value: unknown;

    constructor(type: EffectType) {
        this.type = type;
        this.duration = null;
    }

    abstract apply(target: Target): void;

    abstract unapply(target: Target): void;

    abstract getValue(target: GameObject): Value;
    abstract getValue(): Value | undefined;

    abstract setContext(context: AbilityContext): void;

    getDebugInfo(): { type: EffectName; value: unknown } {
        return {
            type: this.type,
            value: this.value
        };
    }

    recalculate(_target: Target): boolean {
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

    isMilitaryModifier(): this is EffectApplier<MilitaryModifierName> {
        return MilitaryModifiers.some((name) => name === this.type);
    }

    isPoliticalModifier(): this is EffectApplier<PoliticalModifierName> {
        return PoliticalModifiers.some((name) => name === this.type);
    }

    isSkillModifier(): this is EffectApplier<MilitaryModifierName | PoliticalModifierName> {
        return this.isMilitaryModifier() || this.isPoliticalModifier();
    }
}
