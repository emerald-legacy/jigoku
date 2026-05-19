import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class TeachingsOfTheElements extends ProvinceCard {
    static id = 'teachings-of-the-elements';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyProvinceStrength(() => this.getNoOfClaimedRings())
        });
    }

    getNoOfClaimedRings() {
        let claimedRings = Object.values(this.game.rings).filter((ring) => ring.isConsideredClaimed());
        return claimedRings.length;
    }
}
