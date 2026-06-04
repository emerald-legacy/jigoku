import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';

class UnveiledDestiny extends DrawCard {
    static id = 'unveiled-destiny';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context: AbilityContext) => !!context.player.role,
            effect: AbilityDsl.effects.addElementAsAttacker((card) => card.controller.role.getElement())
        });
    }
}


export default UnveiledDestiny;
