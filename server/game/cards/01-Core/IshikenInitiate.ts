import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class IshikenInitiate extends DrawCard {
    static id = 'ishiken-initiate';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyBothSkills(() => this.getNoOfClaimedRings())
        });
    }

    getNoOfClaimedRings() {
        const claimedRings = Object.values(this.game.rings).filter(ring => ring.isConsideredClaimed());
        return claimedRings.length;
    }
}


export default IshikenInitiate;
