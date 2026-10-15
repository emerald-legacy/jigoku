import DrawCard from '../../DrawCard.js';
import { modifyBothSkills } from '../../effects.js';

class UtakuMediator extends DrawCard {
    static id = 'utaku-mediator';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.player.imperialFavor === '',
            effect: modifyBothSkills(1)
        });
    }
}


export default UtakuMediator;
