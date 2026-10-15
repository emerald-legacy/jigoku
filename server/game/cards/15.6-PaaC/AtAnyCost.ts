import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { placeFate } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';

class AtAnyCost extends DrawCard {
    static id = 'at-any-cost';

    setupCardAbilities() {
        this.action('Place a fate on a character')
            .cost(costs.payHonor(3))
            .target({
                cardType: CardType.Character
            }, placeFate({ amount: 2 }));
    }
}


export default AtAnyCost;
