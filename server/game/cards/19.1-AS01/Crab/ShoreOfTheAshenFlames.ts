import { CardType, ConflictType, EffectName, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import type DrawCard from '../../../DrawCard.js';
import type { Conflict } from '../../../Conflict.js';
import type { CardEffect } from '../../../Effects/types.js';

export default class ShoreOfTheAshenFlames extends ProvinceCard {
    static id = 'shore-of-the-ashen-flames';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            targetController: Players.Opponent,
            effect: AbilityDsl.effects.changeConflictSkillFunctionPlayer((card: DrawCard, conflict: Conflict) => {
                const exclusionFunction = (effect: CardEffect) => {
                    if(effect.type === EffectName.AttachmentMilitarySkillModifier) {
                        const value = effect.getValue<number>(card);
                        return value > 0;
                    }
                    if(effect.type === EffectName.AttachmentPoliticalSkillModifier) {
                        const value = effect.getValue<number>(card);
                        return value > 0;
                    }
                    if(
                        effect.type === EffectName.ModifyMilitarySkill ||
                        effect.type === EffectName.ModifyPoliticalSkill ||
                        effect.type === EffectName.ModifyBothSkills
                    ) {
                        if(effect.context && effect.context.source) {
                            const source = effect.context.source;
                            return source && source.type === CardType.Attachment;
                        }
                        return false;
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
