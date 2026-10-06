import { ProvinceCard } from '../../ProvinceCard.js';
import { modifyProvinceStrength } from '../../effects.js';
import { countClaimedRings } from '../claimedRings.js';

export default class TeachingsOfTheElements extends ProvinceCard {
    static id = 'teachings-of-the-elements';

    setupCardAbilities() {
        this.persistentEffect({
            effect: modifyProvinceStrength(() => countClaimedRings(this.game))
        });
    }
}
