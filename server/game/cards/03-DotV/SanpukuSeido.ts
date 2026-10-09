import { ProvinceCard } from '../../ProvinceCard.js';
import { changeConflictSkillFunction } from '../../effects.js';

export default class SanpukuSeido extends ProvinceCard {
    static id = 'sanpuku-seido';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            effect: changeConflictSkillFunction((card) => card.glory)
        });
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}
