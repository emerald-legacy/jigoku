import { ProvinceCard } from '../../ProvinceCard.js';
import { changeConflictSkillFunction } from '../../effects.js';

export default class MassingAtTwilight extends ProvinceCard {
    static id = 'massing-at-twilight';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            effect: changeConflictSkillFunction(
                (_card, _conflict, skills) => skills.military + skills.political
            )
        });
    }
}
