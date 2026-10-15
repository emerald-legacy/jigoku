import DrawCard from '../../DrawCard.js';
import { calculatePrintedMilitarySkill } from '../../effects.js';

class IronCraneLegion extends DrawCard {
    static id = 'iron-crane-legion';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.game.isDuringConflict(),
            effect: calculatePrintedMilitarySkill((card) => card.controller.opponent?.hand.length ?? 0)
        });
    }
}


export default IronCraneLegion;

