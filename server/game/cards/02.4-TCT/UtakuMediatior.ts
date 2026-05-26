import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class UtakuMediator extends DrawCard {
    static id = 'utaku-mediator';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            condition: context => context.player.imperialFavor === '',
            effect: ability.effects.modifyBothSkills(1)
        });
    }
}


export default UtakuMediator;
