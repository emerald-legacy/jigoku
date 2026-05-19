import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class ShibaRyuu extends DrawCard {
    static id = 'shiba-ryuu';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            effect: AbilityDsl.effects.changeConflictSkillFunction(
                (card: DrawCard) => card.getMilitarySkill() + card.getPoliticalSkill()
            )
        });
    }
}
