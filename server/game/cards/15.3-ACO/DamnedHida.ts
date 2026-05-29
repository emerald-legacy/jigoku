import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class DamnedHida extends DrawCard {
    static id = 'damned-hida';

    setupCardAbilities() {
        this.dire({
            effect: AbilityDsl.effects.modifyMilitarySkill(3)
        });
    }
}


export default DamnedHida;
