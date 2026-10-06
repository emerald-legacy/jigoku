import { changeConflictSkillFunction } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class ShibaRyuu extends DrawCard {
    static id = 'shiba-ryuu';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            effect: changeConflictSkillFunction(
                (card) => card.getMilitarySkill() + card.getPoliticalSkill()
            )
        });
    }
}
