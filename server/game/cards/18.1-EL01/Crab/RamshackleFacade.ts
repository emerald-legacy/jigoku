import DrawCard from '../../../DrawCard.js';
import { Players, CardType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { bow } from '../../../GameActions/GameActions.js';

class RamshackleFacade extends DrawCard {
    static id = 'ramshackle-facade';

    setupCardAbilities() {
        this.action('Bow a character')
            .cost(costs.sacrifice({
                cardType: CardType.Holding
            }))
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isAttacking() && card.costLessThan(4)
            }, bow());
    }
}


export default RamshackleFacade;
