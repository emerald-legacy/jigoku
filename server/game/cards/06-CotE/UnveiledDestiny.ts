import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class UnveiledDestiny extends DrawCard {
    static id = 'unveiled-destiny';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => !!context.player.role,
            effect: AbilityDsl.effects.addElementAsAttacker(card => card.controller.role.getElement())
        });
    }
}


export default UnveiledDestiny;
