import { modifyBothSkills } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
class KitsukiCounselor extends DrawCard {
    static id = 'kitsuki-counselor';

    setupCardAbilities() {
        this.composure({
            effect: modifyBothSkills(1)
        });
    }
}
export default KitsukiCounselor;
