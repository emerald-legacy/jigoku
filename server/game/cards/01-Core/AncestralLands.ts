import { ProvinceCard } from '../../ProvinceCard.js';
import { modifyProvinceStrength } from '../../effects.js';
import { ConflictType } from '../../Constants.js';

export default class AncestralLands extends ProvinceCard {
    static id = 'ancestral-lands';

    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict(ConflictType.Political),
            effect: modifyProvinceStrength(5)
        });
    }
}
