import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class UnveiledDestiny extends DrawCard {
    static id = 'unveiled-destiny';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context: any) => !!context.player.role,
            effect: AbilityDsl.effects.addElementAsAttacker((card: any) => card.controller.role.getElement())
        });
    }
}


export default UnveiledDestiny;
