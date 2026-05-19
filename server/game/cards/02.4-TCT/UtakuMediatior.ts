import DrawCard from '../../drawcard.js';

class UtakuMediator extends DrawCard {
    static id = 'utaku-mediator';

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.player.imperialFavor === '',
            effect: ability.effects.modifyBothSkills(1)
        });
    }
}


export default UtakuMediator;
