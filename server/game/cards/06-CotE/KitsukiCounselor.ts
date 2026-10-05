import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
class KitsukiCounselor extends DrawCard {
    static id = 'kitsuki-counselor';

    setupCardAbilities() {
        this.composure({
            effect: AbilityDsl.effects.modifyBothSkills(1)
        });
    }
}
export default KitsukiCounselor;
