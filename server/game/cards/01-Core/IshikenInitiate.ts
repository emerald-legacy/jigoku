import DrawCard from '../../DrawCard.js';
import { modifyBothSkills } from '../../effects.js';
import { countClaimedRings } from '../claimedRings.js';

class IshikenInitiate extends DrawCard {
    static id = 'ishiken-initiate';

    setupCardAbilities() {
        this.persistentEffect({
            effect: modifyBothSkills(() => countClaimedRings(this.game))
        });
    }
}


export default IshikenInitiate;
