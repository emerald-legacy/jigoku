import DrawCard from '../../DrawCard.js';
import { modifyBothSkills } from '../../effects.js';

class SeekerOfEnlightenment extends DrawCard {
    static id = 'seeker-of-enlightenment';

    setupCardAbilities() {
        this.persistentEffect({
            effect: modifyBothSkills(() => this.getFateOnRings())
        });
    }

    getFateOnRings() {
        return Object.values(this.game.rings).reduce((fate, ring) => {
            if(ring.isUnclaimed()) {
                return fate + ring.fate;
            }
            return fate;
        }, 0);
    }
}


export default SeekerOfEnlightenment;
