import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { countClaimedRings } from '../claimedRings.js';

export default class TeachingsOfTheElements extends ProvinceCard {
    static id = 'teachings-of-the-elements';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyProvinceStrength(() => countClaimedRings(this.game))
        });
    }
}
