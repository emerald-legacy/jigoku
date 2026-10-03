import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class UtakuMediator extends DrawCard {
    static id = 'utaku-mediator';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.player.imperialFavor === '',
            effect: AbilityDsl.effects.modifyBothSkills(1)
        });
    }
}


export default UtakuMediator;
