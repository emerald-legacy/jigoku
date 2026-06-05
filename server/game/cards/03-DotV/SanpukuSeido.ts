import type DrawCard from '../../DrawCard.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class SanpukuSeido extends ProvinceCard {
    static id = 'sanpuku-seido';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            effect: AbilityDsl.effects.changeConflictSkillFunction((card: DrawCard) => card.getGlory())
        });
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}
