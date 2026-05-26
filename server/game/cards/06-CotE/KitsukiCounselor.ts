import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
class KitsukiCounselor extends DrawCard {
    static id = 'kitsuki-counselor';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.composure({
            effect: ability.effects.modifyBothSkills(1)
        });
    }
}
export default KitsukiCounselor;
