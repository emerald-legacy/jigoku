import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { countClaimedRings } from '../claimedRings.js';

class IshikenInitiate extends DrawCard {
    static id = 'ishiken-initiate';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyBothSkills(() => countClaimedRings(this.game))
        });
    }
}


export default IshikenInitiate;
