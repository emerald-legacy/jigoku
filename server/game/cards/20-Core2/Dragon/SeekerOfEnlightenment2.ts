import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class SeekerOfEnlightenment2 extends DrawCard {
    static id = 'seeker-of-enlightenment-2';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyBothSkills(() => this.getFateOnRings())
        });
    }

    getFateOnRings() {
        let total = 0;
        for(const ring of Object.values(this.game.rings)) {
            total += ring.fate;
        }
        return total;
    }
}
