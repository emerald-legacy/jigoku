import { EffectName } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class KissOfTheSea extends DrawCard {
    static id = 'kiss-of-the-sea';

    setupCardAbilities() {
        this.reaction('Bow attached character')
            .when({
                onEffectApplied: (event, context) => {
                    const effects: string[] = [
                        EffectName.ModifyBothSkills,
                        EffectName.ModifyMilitarySkill,
                        EffectName.ModifyMilitarySkillMultiplier,
                        EffectName.ModifyPoliticalSkill,
                        EffectName.ModifyPoliticalSkillMultiplier,
                        EffectName.SwitchBaseSkills,
                        EffectName.SetMilitarySkill,
                        EffectName.SetPoliticalSkill,
                        EffectName.SetBaseMilitarySkill,
                        EffectName.SetBasePoliticalSkill,
                        EffectName.SetBaseDash
                    ];

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

                    for(let i = 0; i < event.effectTypes.length; i++) {
                        if(effects.includes(event.effectTypes[i])) {
                            return true;
                        }
                    }
                    return false;
                }
            })
            .bow((context) => ({
                target: context.source.parentCharacter ?? []
            }));
    }
}
