import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { perRound } from '../../AbilityLimit.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';

class Assassination extends DrawCard {
    static id = 'assassination';

    setupCardAbilities() {
        this.conflictAction('Discard a character')
            .cost(costs.payHonor(3))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.costLessThan(3)
            }, discardFromPlay())
            .max(perRound(1));
    }
}


export default Assassination;
