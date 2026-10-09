import DrawCard from '../../DrawCard.js';
import { addElementAsAttacker } from '../../effects.js';

class UnveiledDestiny extends DrawCard {
    static id = 'unveiled-destiny';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => !!context.player.role,
            effect: addElementAsAttacker((card) => card.controller.role?.getElement() ?? [])
        });
    }
}


export default UnveiledDestiny;
