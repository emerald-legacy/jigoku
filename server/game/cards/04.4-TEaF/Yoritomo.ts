import DrawCard from '../../drawcard.js';

class Yoritomo extends DrawCard {
    static id = 'yoritomo';

    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyBothSkills(card => card.controller.fate)
        });
    }
}


export default Yoritomo;
