import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players } from '../../Constants.js';

class Deduction extends DrawCard {
    static id = 'deduction';

    setupCardAbilities() {
        this.action('Bow a character')
            .cost(AbilityDsl.costs.returnRings(1))
            .condition(() => !!this.game.currentConflict && this.game.currentConflict.conflictType === 'political')
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.costLessThan(4) && card.isParticipating()
            }, AbilityDsl.actions.bow());
    }
}


export default Deduction;
