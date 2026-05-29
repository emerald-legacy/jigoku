import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class IronCraneLegion extends DrawCard {
    static id = 'iron-crane-legion';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.game.isDuringConflict(),
            effect: AbilityDsl.effects.calculatePrintedMilitarySkill((card: any) => card.controller.opponent && card.controller.opponent.hand.length)
        });
    }
}


export default IronCraneLegion;

