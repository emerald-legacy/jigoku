import { CardType, ConflictType, EffectName, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { changeConflictSkillFunctionPlayer } from '../../../effects.js';
import type { Conflict } from '../../../Conflict.js';
import { isEffectOf, isEffectOfAny } from '../../../Effects/types.js';
import type { EffectApplier } from '../../../Effects/EffectApplier.js';

export default class ShoreOfTheAshenFlames extends ProvinceCard {
    static id = 'shore-of-the-ashen-flames';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            targetController: Players.Opponent,
            effect: changeConflictSkillFunctionPlayer((card, conflict: Conflict) => {
                const exclusionFunction = (effect: EffectApplier) => {
                    if(isEffectOf(effect, EffectName.AttachmentMilitarySkillModifier)) {
                        const value = effect.getValue(card);
                        return value > 0;
                    }
                    if(isEffectOf(effect, EffectName.AttachmentPoliticalSkillModifier)) {
                        const value = effect.getValue(card);
                        return value > 0;
                    }
                    if(isEffectOfAny(effect, [EffectName.ModifyMilitarySkill, EffectName.ModifyPoliticalSkill, EffectName.ModifyBothSkills])) {
                        // only increases are blocked; a penalty from an attachment still applies
                        return effect.context?.source?.type === CardType.Attachment && (effect.getValue(card) ?? 0) > 0;
                    }
                    return false;
                };

                if(conflict.conflictType === ConflictType.Military) {
                    return card.getMilitarySkillExcludingModifiers(exclusionFunction);
                }
                return card.getPoliticalSkillExcludingModifiers(exclusionFunction);
            })
        });
    }
}
