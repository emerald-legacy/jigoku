import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class IshikenInitiate extends DrawCard {
    static id = 'ishiken-initiate';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            effect: ability.effects.modifyBothSkills(() => this.getNoOfClaimedRings())
        });
    }

    getNoOfClaimedRings() {
        let claimedRings = Object.values(this.game.rings).filter(ring => ring.isConsideredClaimed());
        return claimedRings.length;
    }
}


export default IshikenInitiate;
