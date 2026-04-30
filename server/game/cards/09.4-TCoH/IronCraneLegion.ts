import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';

class IronCraneLegion extends DrawCard {
    static id = 'iron-crane-legion';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.game.isDuringConflict(),
            effect: AbilityDsl.effects.calculatePrintedMilitarySkill(card => card.controller.opponent && card.controller.opponent.hand.length)
        });
    }
}


export default IronCraneLegion;

