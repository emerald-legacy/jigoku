const DrawCard = require('../../drawcard.js');

class SeekerOfEnlightenment extends DrawCard {
    setupCardAbilities(ability) {
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

SeekerOfEnlightenment.id = 'seeker-of-enlightenment';

module.exports = SeekerOfEnlightenment;
