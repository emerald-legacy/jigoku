import { ProvinceCard } from '../../ProvinceCard.js';
import { modifyProvinceStrength } from '../../effects.js';
import { ConflictType } from '../../Constants.js';

export default class EntrenchedPosition extends ProvinceCard {
    static id = 'entrenched-position';

    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict(ConflictType.Military),
            effect: modifyProvinceStrength(5)
        });
    }
}
