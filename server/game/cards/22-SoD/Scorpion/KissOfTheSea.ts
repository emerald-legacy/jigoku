import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class KissOfTheSea extends DrawCard {
    static id = 'kiss-of-the-sea';

    setupCardAbilities() {
        this.reaction({
            title: 'Bow attached character',
            when: {
                onEffectApplied: (event, context) => {
                    const effects = [
                        'modifyBothSkills',
                        'modifyMilitarySkill',
                        'modifyMilitarySkillMultiplier',
                        'modifyPoliticalSkill',
                        'modifyPoliticalSkillMultiplier',
                        'switchBaseSkills',
                        'setMilitarySkill',
                        'setPoliticalSkill',
                        'setBaseMilitarySkill',
                        'setBasePoliticalSkill',
                        'setBaseDash'
                    ];

                    if(!event.effectTypes) {
                        return false;
                    }

                    if(!event.matches || !event.matches.includes(context.source.parent)) {
                        return false;
                    }

                    for(let i = 0; i < event.effectTypes.length; i++) {
                        if(effects.includes(event.effectTypes[i])) {
                            return true;
                        }
                    }
                    return false;
                }
            },
            gameAction: AbilityDsl.actions.bow(context => ({
                target: context.source.parent
            }))
        });
    }
}
