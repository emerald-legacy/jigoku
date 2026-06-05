import { ProvinceCard } from '../../ProvinceCard.js';
import type DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class MassingAtTwilight extends ProvinceCard {
    static id = 'massing-at-twilight';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            effect: AbilityDsl.effects.changeConflictSkillFunction(
                (card: DrawCard) => card.getMilitarySkill() + card.getPoliticalSkill()
            )
        });
    }
}
