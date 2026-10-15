import { ProvinceCard } from '../../ProvinceCard.js';
import { changeConflictSkillFunction } from '../../effects.js';

export default class MassingAtTwilight extends ProvinceCard {
    static id = 'massing-at-twilight';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            effect: changeConflictSkillFunction(
                (card) => card.militarySkill + card.politicalSkill
            )
        });
    }
}
