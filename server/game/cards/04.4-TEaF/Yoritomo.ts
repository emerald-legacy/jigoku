import { modifyBothSkills } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

class Yoritomo extends DrawCard {
    static id = 'yoritomo';

    override setupCardAbilities() {
        this.persistentEffect({
            effect: modifyBothSkills((card) => card.controller.fate)
        });
    }
}


export default Yoritomo;
