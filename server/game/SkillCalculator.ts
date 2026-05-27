import StatModifier from './StatModifier.js';
import { EffectNames } from './Constants.js';
import type DrawCard from './drawcard.js';
import type { CardEffect } from './Effects/types.js';

export type Exclusions = EffectNames[] | ((effect: CardEffect) => boolean);

interface BaseSkillModifiers {
    baseMilitaryModifiers: StatModifier[];
    baseMilitarySkill: number;
    basePoliticalModifiers: StatModifier[];
    basePoliticalSkill: number;
}

export class SkillCalculator {
    constructor(private card: DrawCard) {}

    getBaseSkillModifiers(): BaseSkillModifiers {
        const baseModifierEffects = [
            EffectNames.CopyCharacter,
            EffectNames.CalculatePrintedMilitarySkill,
            EffectNames.ModifyBaseMilitarySkillMultiplier,
            EffectNames.ModifyBasePoliticalSkillMultiplier,
            EffectNames.SetBaseMilitarySkill,
            EffectNames.SetBasePoliticalSkill,
            EffectNames.SetBaseDash,
            EffectNames.SwitchBaseSkills,
            EffectNames.SetBaseGlory
        ];

        const baseEffects = this.card.getRawEffects().filter((effect: CardEffect) => baseModifierEffects.includes(effect.type));
        let baseMilitaryModifiers = [StatModifier.fromCard(this.card.printedMilitarySkill, this.card, 'Printed skill', false)];
        let basePoliticalModifiers = [StatModifier.fromCard(this.card.printedPoliticalSkill, this.card, 'Printed skill', false)];
        let baseMilitarySkill = this.card.printedMilitarySkill;
        let basePoliticalSkill = this.card.printedPoliticalSkill;

        baseEffects.forEach((effect: CardEffect) => {
            switch(effect.type) {
                case EffectNames.CalculatePrintedMilitarySkill: {
                    const skillFunction = effect.getValue(this.card);
                    const calculatedSkillValue = skillFunction(this.card);
                    baseMilitarySkill = calculatedSkillValue;
                    baseMilitaryModifiers = baseMilitaryModifiers.filter(
                        (mod: StatModifier) =>!mod.name.startsWith('Printed skill')
                    );
                    baseMilitaryModifiers.push(
                        StatModifier.fromEffect(
                            baseMilitarySkill,
                            effect,
                            false,
                            `Printed skill due to ${StatModifier.getEffectName(effect)}`
                        )
                    );
                    break;
                }
                case EffectNames.CopyCharacter: {
                    const copiedCard = effect.getValue(this.card);
                    baseMilitarySkill = copiedCard.getPrintedSkill('military');
                    basePoliticalSkill = copiedCard.getPrintedSkill('political');
                    baseMilitaryModifiers = baseMilitaryModifiers.filter(
                        (mod: StatModifier) =>!mod.name.startsWith('Printed skill')
                    );
                    basePoliticalModifiers = basePoliticalModifiers.filter(
                        (mod: StatModifier) =>!mod.name.startsWith('Printed skill')
                    );
                    baseMilitaryModifiers.push(
                        StatModifier.fromEffect(
                            baseMilitarySkill,
                            effect,
                            false,
                            `Printed skill from ${copiedCard.name} due to ${StatModifier.getEffectName(effect)}`
                        )
                    );
                    basePoliticalModifiers.push(
                        StatModifier.fromEffect(
                            basePoliticalSkill,
                            effect,
                            false,
                            `Printed skill from ${copiedCard.name} due to ${StatModifier.getEffectName(effect)}`
                        )
                    );
                    break;
                }
                case EffectNames.SetBaseDash:
                    if(effect.getValue(this.card) === 'military') {
                        baseMilitaryModifiers.push(
                            StatModifier.fromEffect(NaN, effect, true, StatModifier.getEffectName(effect))
                        );
                        baseMilitarySkill = NaN;
                    }
                    if(effect.getValue(this.card) === 'political') {
                        basePoliticalModifiers.push(
                            StatModifier.fromEffect(NaN, effect, true, StatModifier.getEffectName(effect))
                        );
                        basePoliticalSkill = NaN;
                    }
                    break;
                case EffectNames.SetBaseMilitarySkill:
                    baseMilitarySkill = effect.getValue(this.card);
                    baseMilitaryModifiers.push(
                        StatModifier.fromEffect(
                            baseMilitarySkill,
                            effect,
                            true,
                            `Base set by ${StatModifier.getEffectName(effect)}`
                        )
                    );
                    break;
                case EffectNames.SetBasePoliticalSkill:
                    basePoliticalSkill = effect.getValue(this.card);
                    basePoliticalModifiers.push(
                        StatModifier.fromEffect(
                            basePoliticalSkill,
                            effect,
                            true,
                            `Base set by ${StatModifier.getEffectName(effect)}`
                        )
                    );
                    break;
                case EffectNames.SwitchBaseSkills: {
                    const milChange = Math.max(basePoliticalSkill, 0) - Math.max(baseMilitarySkill, 0);
                    const polChange = Math.max(baseMilitarySkill, 0) - Math.max(basePoliticalSkill, 0);
                    baseMilitarySkill += milChange;
                    basePoliticalSkill += polChange;
                    baseMilitaryModifiers.push(
                        StatModifier.fromEffect(
                            milChange,
                            effect,
                            false,
                            `Base due to ${StatModifier.getEffectName(effect)}`
                        )
                    );
                    basePoliticalModifiers.push(
                        StatModifier.fromEffect(
                            polChange,
                            effect,
                            false,
                            `Base due to ${StatModifier.getEffectName(effect)}`
                        )
                    );
                    break;
                }
                case EffectNames.ModifyBaseMilitarySkillMultiplier: {
                    const milChange = (effect.getValue(this.card) - 1) * baseMilitarySkill;
                    baseMilitarySkill += milChange;
                    baseMilitaryModifiers.push(
                        StatModifier.fromEffect(
                            milChange,
                            effect,
                            false,
                            `Base due to ${StatModifier.getEffectName(effect)}`
                        )
                    );
                    break;
                }
                case EffectNames.ModifyBasePoliticalSkillMultiplier: {
                    const polChange = (effect.getValue(this.card) - 1) * basePoliticalSkill;
                    basePoliticalSkill += polChange;
                    basePoliticalModifiers.push(
                        StatModifier.fromEffect(
                            polChange,
                            effect,
                            false,
                            `Base due to ${StatModifier.getEffectName(effect)}`
                        )
                    );
                    break;
                }
            }
        });

        const overridingMilModifiers = baseMilitaryModifiers.filter((mod: StatModifier) =>mod.overrides);
        if(overridingMilModifiers.length > 0) {
            const lastModifier = overridingMilModifiers[overridingMilModifiers.length - 1];
            baseMilitaryModifiers = [lastModifier];
            baseMilitarySkill = lastModifier.amount;
        }
        const overridingPolModifiers = basePoliticalModifiers.filter((mod: StatModifier) =>mod.overrides);
        if(overridingPolModifiers.length > 0) {
            const lastModifier = overridingPolModifiers[overridingPolModifiers.length - 1];
            basePoliticalModifiers = [lastModifier];
            basePoliticalSkill = lastModifier.amount;
        }

        return {
            baseMilitaryModifiers,
            baseMilitarySkill,
            basePoliticalModifiers,
            basePoliticalSkill
        };
    }

    getMilitaryModifiers(exclusions?: Exclusions): StatModifier[] {
        const baseSkillModifiers = this.getBaseSkillModifiers();
        if(isNaN(baseSkillModifiers.baseMilitarySkill)) {
            return baseSkillModifiers.baseMilitaryModifiers;
        }

        if(!exclusions) {
            exclusions = [];
        }

        let rawEffects;
        if(typeof exclusions === 'function') {
            rawEffects = this.card.getRawEffects().filter((effect: CardEffect) => !exclusions(effect));
        } else {
            rawEffects = this.card.getRawEffects().filter((effect: CardEffect) => !exclusions.includes(effect.type));
        }

        const setEffects = rawEffects.filter(
            (effect: CardEffect) => effect.type === EffectNames.SetMilitarySkill || effect.type === EffectNames.SetDash
        );
        if(setEffects.length > 0) {
            const latestSetEffect = setEffects[setEffects.length - 1];
            const setAmount = latestSetEffect.type === EffectNames.SetDash ? undefined : latestSetEffect.getValue(this.card);
            return [
                StatModifier.fromEffect(
                    setAmount,
                    latestSetEffect,
                    true,
                    `Set by ${StatModifier.getEffectName(latestSetEffect)}`
                )
            ];
        }

        const modifiers = baseSkillModifiers.baseMilitaryModifiers;

        const modifierEffects = rawEffects.filter(
            (effect: CardEffect) =>
                effect.type === EffectNames.AttachmentMilitarySkillModifier ||
                effect.type === EffectNames.ModifyMilitarySkill ||
                effect.type === EffectNames.ModifyBothSkills
        );
        modifierEffects.forEach((modifierEffect: CardEffect) => {
            const value = modifierEffect.getValue(this.card);
            modifiers.push(StatModifier.fromEffect(value, modifierEffect));
        });

        this.adjustHonorStatusModifiers(modifiers);

        const multiplierEffects = rawEffects.filter(
            (effect: CardEffect) => effect.type === EffectNames.ModifyMilitarySkillMultiplier
        );
        multiplierEffects.forEach((multiplierEffect: CardEffect) => {
            const multiplier = multiplierEffect.getValue(this.card);
            const currentTotal = modifiers.reduce((total: number, modifier: StatModifier) => total + modifier.amount, 0);
            const amount = (multiplier - 1) * currentTotal;
            modifiers.push(StatModifier.fromEffect(amount, multiplierEffect));
        });

        return modifiers;
    }

    getPoliticalModifiers(exclusions?: Exclusions): StatModifier[] {
        const baseSkillModifiers = this.getBaseSkillModifiers();
        if(isNaN(baseSkillModifiers.basePoliticalSkill)) {
            return baseSkillModifiers.basePoliticalModifiers;
        }

        if(!exclusions) {
            exclusions = [];
        }

        let rawEffects;
        if(typeof exclusions === 'function') {
            rawEffects = this.card.getRawEffects().filter((effect: CardEffect) => !exclusions(effect));
        } else {
            rawEffects = this.card.getRawEffects().filter((effect: CardEffect) => !exclusions.includes(effect.type));
        }

        const setEffects = rawEffects.filter((effect: CardEffect) => effect.type === EffectNames.SetPoliticalSkill);
        if(setEffects.length > 0) {
            const latestSetEffect = setEffects[setEffects.length - 1];
            const setAmount = latestSetEffect.getValue(this.card);
            return [
                StatModifier.fromEffect(
                    setAmount,
                    latestSetEffect,
                    true,
                    `Set by ${StatModifier.getEffectName(latestSetEffect)}`
                )
            ];
        }

        const modifiers = baseSkillModifiers.basePoliticalModifiers;

        const modifierEffects = rawEffects.filter(
            (effect: CardEffect) =>
                effect.type === EffectNames.AttachmentPoliticalSkillModifier ||
                effect.type === EffectNames.ModifyPoliticalSkill ||
                effect.type === EffectNames.ModifyBothSkills
        );
        modifierEffects.forEach((modifierEffect: CardEffect) => {
            const value = modifierEffect.getValue(this.card);
            modifiers.push(StatModifier.fromEffect(value, modifierEffect));
        });

        this.adjustHonorStatusModifiers(modifiers);

        const multiplierEffects = rawEffects.filter(
            (effect: CardEffect) => effect.type === EffectNames.ModifyPoliticalSkillMultiplier
        );
        multiplierEffects.forEach((multiplierEffect: CardEffect) => {
            const multiplier = multiplierEffect.getValue(this.card);
            const currentTotal = modifiers.reduce((total: number, modifier: StatModifier) => total + modifier.amount, 0);
            const amount = (multiplier - 1) * currentTotal;
            modifiers.push(StatModifier.fromEffect(amount, multiplierEffect));
        });

        return modifiers;
    }

    adjustHonorStatusModifiers(modifiers: StatModifier[]): void {
        const doesNotModifyEffects = this.card.getRawEffects().filter(
            (effect: CardEffect) => effect.type === EffectNames.HonorStatusDoesNotModifySkill
        );
        let doesNotModifyConflictEffects = false;
        if(this.card.game.currentConflict && this.card.isParticipating()) {
            doesNotModifyConflictEffects = this.card.game.currentConflict.anyEffect(EffectNames.ConflictIgnoreStatusTokens);
        }
        if(doesNotModifyEffects.length > 0 || doesNotModifyConflictEffects) {
            modifiers.forEach((modifier: StatModifier) => {
                if((modifier.type as string) === 'token' && modifier.amount !== 0) {
                    modifier.amount = 0;
                    modifier.name += ` (${StatModifier.getEffectName(doesNotModifyEffects[0])})`;
                }
            });
        }
        const reverseEffects = this.card.getRawEffects().filter(
            (effect: CardEffect) => effect.type === EffectNames.HonorStatusReverseModifySkill
        );
        if(reverseEffects.length > 0) {
            modifiers.forEach((modifier: StatModifier) => {
                if((modifier.type as string) === 'token' && modifier.amount !== 0 && modifier.name === 'Dishonored Token') {
                    modifier.amount = 0 - modifier.amount;
                    modifier.name += ` (${StatModifier.getEffectName(reverseEffects[0])})`;
                }
            });
        }
    }

    getStatusTokenModifiers(): StatModifier[] {
        let modifiers: StatModifier[] = [];
        const modifierEffects = this.card.getRawEffects().filter(
            (effect: CardEffect) => effect.type === EffectNames.ModifyBothSkills
        );
        modifierEffects.forEach((modifierEffect: CardEffect) => {
            const value = modifierEffect.getValue(this.card);
            modifiers.push(StatModifier.fromEffect(value, modifierEffect));
        });
        modifiers = modifiers.filter((modifier: StatModifier) => (modifier.type as string) === 'token');
        this.adjustHonorStatusModifiers(modifiers);
        return modifiers;
    }

    getStatusTokenSkill(): number {
        const modifiers = this.getStatusTokenModifiers();
        const skill = modifiers.reduce((total: number, modifier: StatModifier) => total + modifier.amount, 0);
        if(isNaN(skill)) {
            return 0;
        }
        return skill;
    }

    getGloryModifiers(): StatModifier[] {
        const gloryModifierEffects = [
            EffectNames.CopyCharacter,
            EffectNames.SetGlory,
            EffectNames.ModifyGlory,
            EffectNames.SetBaseGlory
        ];

        if(this.card.printedGlory === undefined) {
            return [];
        }

        const gloryEffects = this.card.getRawEffects().filter((effect: CardEffect) => gloryModifierEffects.includes(effect.type));
        const gloryModifiers: StatModifier[] = [];

        const setEffects = gloryEffects.filter((effect: CardEffect) => effect.type === EffectNames.SetGlory);
        if(setEffects.length > 0) {
            const latestSetEffect = setEffects[setEffects.length - 1];
            const setAmount = latestSetEffect.getValue(this.card);
            return [
                StatModifier.fromEffect(
                    setAmount,
                    latestSetEffect,
                    true,
                    `Set by ${StatModifier.getEffectName(latestSetEffect)}`
                )
            ];
        }

        const baseEffects = gloryEffects.filter((effect: CardEffect) => effect.type === EffectNames.SetBaseGlory);
        const copyEffects = gloryEffects.filter((effect: CardEffect) => effect.type === EffectNames.CopyCharacter);
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

        const modifierEffects = gloryEffects.filter((effect: CardEffect) => effect.type === EffectNames.ModifyGlory);
        modifierEffects.forEach((modifierEffect: CardEffect) => {
            const value = modifierEffect.getValue(this.card);
            gloryModifiers.push(StatModifier.fromEffect(value, modifierEffect));
        });

        return gloryModifiers;
    }

    getProvinceStrengthBonusModifiers(): StatModifier[] {
        const strengthModifierEffects = [EffectNames.SetProvinceStrengthBonus, EffectNames.ModifyProvinceStrengthBonus];

        if(this.card.printedStrengthBonus === undefined) {
            return [];
        }

        const strengthEffects = this.card.getRawEffects().filter((effect: CardEffect) =>
            strengthModifierEffects.includes(effect.type)
        );
        const strengthModifiers: StatModifier[] = [];

        const setEffects = strengthEffects.filter(
            (effect: CardEffect) => effect.type === EffectNames.SetProvinceStrengthBonus
        );
        if(setEffects.length > 0) {
            const latestSetEffect = setEffects[setEffects.length - 1];
            const setAmount = latestSetEffect.getValue(this.card);
            return [
                StatModifier.fromEffect(
                    setAmount,
                    latestSetEffect,
                    true,
                    `Set by ${StatModifier.getEffectName(latestSetEffect)}`
                )
            ];
        }

        strengthModifiers.push(
            StatModifier.fromCard(this.card.printedStrengthBonus, this.card, 'Printed province strength bonus', false)
        );
        const modifierEffects = strengthEffects.filter(
            (effect: CardEffect) => effect.type === EffectNames.ModifyProvinceStrengthBonus
        );
        modifierEffects.forEach((modifierEffect: CardEffect) => {
            const value = modifierEffect.getValue(this.card);
            strengthModifiers.push(StatModifier.fromEffect(value, modifierEffect));
        });

        return strengthModifiers;
    }
}
