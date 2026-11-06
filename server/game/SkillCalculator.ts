import { StatModifier } from './StatModifier.js';
import { CharacterStatus, EffectName, ObjectType, SkillType } from './Constants.js';
import type { EffectSource } from './EffectSource.js';
import type DrawCard from './DrawCard.js';
import { isEffectOf, isEffectOfAny } from './Effects/types.js';
import type { EffectApplier } from './Effects/EffectApplier.js';

export type Exclusions = EffectName[] | ((effect: EffectApplier) => boolean);

const skillEffectNames = {
    military: {
        printed: 'printedMilitarySkill',
        setBase: EffectName.SetBaseMilitarySkill,
        baseMultiplier: EffectName.ModifyBaseMilitarySkillMultiplier,
        setSkill: EffectName.SetMilitarySkill,
        modifiers: [EffectName.AttachmentMilitarySkillModifier, EffectName.ModifyMilitarySkill, EffectName.ModifyBothSkills],
        multiplier: EffectName.ModifyMilitarySkillMultiplier
    },
    political: {
        printed: 'printedPoliticalSkill',
        setBase: EffectName.SetBasePoliticalSkill,
        baseMultiplier: EffectName.ModifyBasePoliticalSkillMultiplier,
        setSkill: EffectName.SetPoliticalSkill,
        modifiers: [EffectName.AttachmentPoliticalSkillModifier, EffectName.ModifyPoliticalSkill, EffectName.ModifyBothSkills],
        multiplier: EffectName.ModifyPoliticalSkillMultiplier
    }
} as const;

const skillTypes = [SkillType.Military, SkillType.Political] as const;

const baseModifierEffects = [
    EffectName.CopyCharacter,
    EffectName.CalculatePrintedMilitarySkill,
    EffectName.ModifyBaseMilitarySkillMultiplier,
    EffectName.ModifyBasePoliticalSkillMultiplier,
    EffectName.SetBaseMilitarySkill,
    EffectName.SetBasePoliticalSkill,
    EffectName.SetBaseDash,
    EffectName.SwitchBaseSkills
];

export interface BaseSkill {
    skill: number;
    modifiers: StatModifier[];
}

export class SkillCalculator {
    constructor(private card: DrawCard) {}

    private getModifier(value: number, effect: EffectApplier): StatModifier {
        const modifier = StatModifier.fromEffect(value, effect);
        const source: EffectSource | undefined = effect.context?.source;
        if(source?.isToken()) {
            modifier.status = source.grantedStatus;
        }
        return modifier;
    }

    /** Both base skills in one pass, because Copy Character and Switch Base Skills change both. */
    getBaseSkills(): Record<SkillType, BaseSkill> {
        const base: Record<SkillType, BaseSkill> = {
            [SkillType.Military]: this.printedBaseSkill(SkillType.Military),
            [SkillType.Political]: this.printedBaseSkill(SkillType.Political)
        };
        const replacePrinted = (baseSkill: BaseSkill, skill: number, modifier: StatModifier) => {
            baseSkill.skill = skill;
            baseSkill.modifiers = baseSkill.modifiers.filter((mod) => !mod.name.startsWith('Printed skill'));
            baseSkill.modifiers.push(modifier);
        };
        const addChange = (baseSkill: BaseSkill, change: number, effect: EffectApplier) => {
            baseSkill.skill += change;
            baseSkill.modifiers.push(StatModifier.fromEffect(change, effect, false, `Base due to ${StatModifier.getEffectName(effect)}`));
        };

        const baseEffects = this.card.getRawEffects().filter((effect) => baseModifierEffects.includes(effect.type));
        for(const effect of baseEffects) {
            if(isEffectOf(effect, EffectName.CalculatePrintedMilitarySkill)) {
                const skill = effect.getValue(this.card)(this.card);
                replacePrinted(base[SkillType.Military], skill,
                    StatModifier.fromEffect(skill, effect, false, `Printed skill due to ${StatModifier.getEffectName(effect)}`));
            } else if(isEffectOf(effect, EffectName.CopyCharacter)) {
                const copiedCard = effect.getValue(this.card);
                for(const type of skillTypes) {
                    const skill = copiedCard.getPrintedSkill(type);
                    replacePrinted(base[type], skill, StatModifier.fromEffect(
                        skill, effect, false, `Printed skill from ${copiedCard.name} due to ${StatModifier.getEffectName(effect)}`
                    ));
                }
            } else if(isEffectOf(effect, EffectName.SwitchBaseSkills)) {
                const military = Math.max(base[SkillType.Military].skill, 0);
                const political = Math.max(base[SkillType.Political].skill, 0);
                addChange(base[SkillType.Military], political - military, effect);
                addChange(base[SkillType.Political], military - political, effect);
            } else {
                for(const type of skillTypes) {
                    const names = skillEffectNames[type];
                    const baseSkill = base[type];
                    if(isEffectOf(effect, EffectName.SetBaseDash) && effect.getValue(this.card) === type) {
                        baseSkill.skill = NaN;
                        baseSkill.modifiers.push(StatModifier.fromEffect(NaN, effect, true, StatModifier.getEffectName(effect)));
                    } else if(isEffectOf(effect, names.setBase)) {
                        baseSkill.skill = effect.getValue(this.card);
                        baseSkill.modifiers.push(
                            StatModifier.fromEffect(baseSkill.skill, effect, true, `Base set by ${StatModifier.getEffectName(effect)}`)
                        );
                    } else if(isEffectOf(effect, names.baseMultiplier)) {
                        addChange(baseSkill, (effect.getValue(this.card) - 1) * baseSkill.skill, effect);
                    }
                }
            }
        }

        for(const baseSkill of Object.values(base)) {
            const lastOverride = baseSkill.modifiers.filter((mod) => mod.overrides).at(-1);
            if(lastOverride) {
                baseSkill.modifiers = [lastOverride];
                baseSkill.skill = lastOverride.amount;
            }
        }
        return base;
    }

    private printedBaseSkill(type: SkillType): BaseSkill {
        const skill = this.card[skillEffectNames[type].printed];
        return { skill, modifiers: [StatModifier.fromCard(skill, this.card, 'Printed skill', false)] };
    }

    getSkillModifiers(type: SkillType, exclusions: Exclusions = []): StatModifier[] {
        const names = skillEffectNames[type];
        const { skill: baseSkill, modifiers } = this.getBaseSkills()[type];
        if(isNaN(baseSkill)) {
            return modifiers;
        }

        const rawEffects = typeof exclusions === 'function'
            ? this.card.getRawEffects().filter((effect) => !exclusions(effect))
            : this.card.getRawEffects().filter((effect) => !exclusions.includes(effect.type));

        const setEffects = rawEffects.filter((effect) =>
            isEffectOf(effect, names.setSkill) || (isEffectOf(effect, EffectName.SetDash) && effect.getValue(this.card) === type)
        );
        if(setEffects.length > 0) {
            const latestSetEffect = setEffects[setEffects.length - 1];
            // a dash is NaN
            const setAmount = isEffectOf(latestSetEffect, names.setSkill) ? latestSetEffect.getValue(this.card) : NaN;
            return [StatModifier.setBy(setAmount, latestSetEffect)];
        }

        const modifierEffects = rawEffects.filter((effect) => isEffectOfAny(effect, names.modifiers));
        modifierEffects.forEach((modifierEffect) => {
            modifiers.push(this.getModifier(modifierEffect.getValue(this.card), modifierEffect));
        });

        this.adjustHonorStatusModifiers(modifiers);

        const multiplierEffects = rawEffects.filter((effect) => isEffectOf(effect, names.multiplier));
        multiplierEffects.forEach((multiplierEffect) => {
            const multiplier = multiplierEffect.getValue(this.card);
            const currentTotal = modifiers.reduce((total, modifier) => total + modifier.amount, 0);
            const amount = (multiplier - 1) * currentTotal;
            modifiers.push(StatModifier.fromEffect(amount, multiplierEffect));
        });

        return modifiers;
    }

    adjustHonorStatusModifiers(modifiers: StatModifier[]): void {
        const doesNotModifyEffects = this.card.getRawEffects().filter(
            (effect) => effect.type === EffectName.HonorStatusDoesNotModifySkill
        );
        let doesNotModifyConflictEffects = false;
        if(this.card.game.currentConflict && this.card.isParticipating()) {
            doesNotModifyConflictEffects = this.card.game.currentConflict.anyEffect(EffectName.ConflictIgnoreStatusTokens);
        }
        if(doesNotModifyEffects.length > 0 || doesNotModifyConflictEffects) {
            modifiers.forEach((modifier) => {
                if(modifier.type === ObjectType.Token && modifier.amount !== 0) {
                    modifier.amount = 0;
                    modifier.name += ` (${StatModifier.getEffectName(doesNotModifyEffects[0])})`;
                }
            });
        }
        const reverseEffects = this.card.getRawEffects().filter(
            (effect) => effect.type === EffectName.HonorStatusReverseModifySkill
        );
        if(reverseEffects.length > 0) {
            modifiers.forEach((modifier) => {
                if(modifier.type === ObjectType.Token && modifier.amount !== 0 && modifier.status === CharacterStatus.Dishonored) {
                    modifier.amount = 0 - modifier.amount;
                    modifier.name += ` (${StatModifier.getEffectName(reverseEffects[0])})`;
                }
            });
        }
        const doesNotDecreaseEffects = this.card.getRawEffects().filter(
            (effect) => effect.type === EffectName.StatusTokensDoNotDecreaseSkill
        );
        if(doesNotDecreaseEffects.length > 0) {
            modifiers.forEach((modifier) => {
                if(modifier.type === ObjectType.Token && modifier.amount < 0) {
                    modifier.amount = 0;
                    modifier.name += ` (${StatModifier.getEffectName(doesNotDecreaseEffects[0])})`;
                }
            });
        }
    }

    getStatusTokenModifiers(): StatModifier[] {
        let modifiers: StatModifier[] = [];
        const modifierEffects = this.card.getRawEffects().filter((effect) => isEffectOf(effect, EffectName.ModifyBothSkills));
        modifierEffects.forEach((modifierEffect) => {
            modifiers.push(this.getModifier(modifierEffect.getValue(this.card), modifierEffect));
        });
        modifiers = modifiers.filter((modifier) => modifier.type === ObjectType.Token);
        this.adjustHonorStatusModifiers(modifiers);
        return modifiers;
    }

    getStatusTokenSkill(): number {
        const modifiers = this.getStatusTokenModifiers();
        const skill = modifiers.reduce((total, modifier) => total + modifier.amount, 0);
        if(isNaN(skill)) {
            return 0;
        }
        return skill;
    }

    getGloryModifiers(): StatModifier[] {
        const gloryModifierEffects = [
            EffectName.CopyCharacter,
            EffectName.SetGlory,
            EffectName.ModifyGlory,
            EffectName.SetBaseGlory
        ];

        const gloryEffects = this.card.getRawEffects().filter((effect) => gloryModifierEffects.includes(effect.type));
        const gloryModifiers: StatModifier[] = [];

        const setEffects = gloryEffects.filter((effect) => isEffectOf(effect, EffectName.SetGlory));
        if(setEffects.length > 0) {
            const latestSetEffect = setEffects[setEffects.length - 1];
            const setAmount = latestSetEffect.getValue(this.card);
            return [StatModifier.setBy(setAmount, latestSetEffect)];
        }

        const baseEffects = gloryEffects.filter((effect) => isEffectOf(effect, EffectName.SetBaseGlory));
        const copyEffects = gloryEffects.filter((effect) => isEffectOf(effect, EffectName.CopyCharacter));
        if(baseEffects.length > 0) {
            const latestBaseEffect = baseEffects[baseEffects.length - 1];
            const baseAmount = latestBaseEffect.getValue(this.card);
            gloryModifiers.push(
                StatModifier.fromEffect(
                    baseAmount,
                    latestBaseEffect,
                    true,
                    `Base set by ${StatModifier.getEffectName(latestBaseEffect)}`
                )
            );
        } else if(copyEffects.length > 0) {
            const latestCopyEffect = copyEffects[copyEffects.length - 1];
            const copiedCard = latestCopyEffect.getValue(this.card);
            gloryModifiers.push(
                StatModifier.fromEffect(
                    copiedCard.printedGlory,
                    latestCopyEffect,
                    false,
                    `Printed glory from ${copiedCard.name} due to ${StatModifier.getEffectName(latestCopyEffect)}`
                )
            );
        } else {
            gloryModifiers.push(StatModifier.fromCard(this.card.printedGlory, this.card, 'Printed glory', false));
        }

        const modifierEffects = gloryEffects.filter((effect) => isEffectOf(effect, EffectName.ModifyGlory));
        modifierEffects.forEach((modifierEffect) => {
            const value = modifierEffect.getValue(this.card);
            gloryModifiers.push(StatModifier.fromEffect(value, modifierEffect));
        });

        return gloryModifiers;
    }

    getProvinceStrengthBonusModifiers(): StatModifier[] {
        const strengthModifierEffects = [EffectName.SetProvinceStrengthBonus, EffectName.ModifyProvinceStrengthBonus, EffectName.CopyCharacter];

        const strengthEffects = this.card.getRawEffects().filter((effect) =>
            strengthModifierEffects.includes(effect.type)
        );
        const strengthModifiers: StatModifier[] = [];

        const setEffects = strengthEffects.filter((effect) => isEffectOf(effect, EffectName.SetProvinceStrengthBonus));
        if(setEffects.length > 0) {
            const latestSetEffect = setEffects[setEffects.length - 1];
            const setAmount = latestSetEffect.getValue(this.card);
            return [StatModifier.setBy(setAmount, latestSetEffect)];
        }

        const copyEffect = strengthEffects.filter((effect) => isEffectOf(effect, EffectName.CopyCharacter)).at(-1);
        if(copyEffect) {
            const copiedCard = copyEffect.getValue(this.card);
            strengthModifiers.push(
                StatModifier.fromEffect(
                    copiedCard.printedStrengthBonus,
                    copyEffect,
                    false,
                    `Printed province strength bonus from ${copiedCard.name} due to ${StatModifier.getEffectName(copyEffect)}`
                )
            );
        } else {
            strengthModifiers.push(
                StatModifier.fromCard(this.card.printedStrengthBonus, this.card, 'Printed province strength bonus', false)
            );
        }
        const modifierEffects = strengthEffects.filter((effect) => isEffectOf(effect, EffectName.ModifyProvinceStrengthBonus));
        modifierEffects.forEach((modifierEffect) => {
            const value = modifierEffect.getValue(this.card);
            strengthModifiers.push(StatModifier.fromEffect(value, modifierEffect));
        });

        return strengthModifiers;
    }
}
