import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class Yoritomo extends DrawCard {
    static id = 'yoritomo';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyBothSkills((card) => card.controller.fate)
        });
    }
}


export default Yoritomo;
