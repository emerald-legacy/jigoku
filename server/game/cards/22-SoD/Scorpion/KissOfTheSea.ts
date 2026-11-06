import { EffectName } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

const SKILL_EFFECTS: ReadonlySet<EffectName> = new Set([
    EffectName.ModifyBothSkills,
    EffectName.ModifyMilitarySkill,
    EffectName.ModifyMilitarySkillMultiplier,
    EffectName.ModifyBaseMilitarySkillMultiplier,
    EffectName.ModifyBasePoliticalSkillMultiplier,
    EffectName.SwitchAttachmentSkillModifiers,
    EffectName.ModifyPoliticalSkill,
    EffectName.ModifyPoliticalSkillMultiplier,
    EffectName.SwitchBaseSkills,
    EffectName.SetMilitarySkill,
    EffectName.SetPoliticalSkill,
    EffectName.SetBaseMilitarySkill,
    EffectName.SetBasePoliticalSkill,
    EffectName.SetBaseDash
]);

export default class KissOfTheSea extends DrawCard {
    static id = 'kiss-of-the-sea';

    override setupCardAbilities() {
        this.reaction('Bow attached character')
            .when({
                onEffectApplied: (event, context) => {
                    if(!event.effectTypes) {
                        return false;
                    }

                    const parent = context.source.parentCharacter;
                    if(!parent || !event.matches || !event.matches.includes(parent)) {
                        return false;
                    }

                    if(!parent.isParticipating()) {
                        return false;
                    }

                    return event.effectTypes.some((type) => SKILL_EFFECTS.has(type));
                }
            })
            .bow((context) => ({
                target: context.source.parentCharacter ?? []
            }));
    }
}
