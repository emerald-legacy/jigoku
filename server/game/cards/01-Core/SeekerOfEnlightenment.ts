import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class SeekerOfEnlightenment extends DrawCard {
    static id = 'seeker-of-enlightenment';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            effect: ability.effects.modifyBothSkills(() => this.getFateOnRings())
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
