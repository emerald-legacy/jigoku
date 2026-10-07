import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { bow } from '../../GameActions/GameActions.js';
import { CardType, ConflictType, Players } from '../../Constants.js';

class Deduction extends DrawCard {
    static id = 'deduction';

    setupCardAbilities() {
        this.action('Bow a character')
            .cost(costs.returnRings(1))
            .condition(() => this.game.isDuringConflict(ConflictType.Political))
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.costLessThan(4) && card.isParticipating()
            }, bow());
    }
}


export default Deduction;
