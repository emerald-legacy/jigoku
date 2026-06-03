import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players } from '../../Constants.js';

class Deduction extends DrawCard {
    static id = 'deduction';

    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: () => !!this.game.currentConflict && this.game.currentConflict.conflictType === 'political',
            cost: AbilityDsl.costs.returnRings(1),
            target: {
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.costLessThan(4) && card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}


export default Deduction;
