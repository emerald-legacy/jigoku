import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

class Yoritomo extends DrawCard {
    static id = 'yoritomo';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyBothSkills((card: any) => card.controller.fate)
        });
    }
}


export default Yoritomo;
