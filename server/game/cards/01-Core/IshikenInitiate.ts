import DrawCard from '../../drawcard.js';

class IshikenInitiate extends DrawCard {
    static id = 'ishiken-initiate';

    setupCardAbilities(ability) {
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
