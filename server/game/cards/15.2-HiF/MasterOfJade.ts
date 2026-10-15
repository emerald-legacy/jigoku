import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { placeFate } from '../../GameActions/GameActions.js';

class MasterOfJade extends DrawCard {
    static id = 'master-of-jade';

    setupCardAbilities() {
        this.action('Lose 2 honor to put a fate on a character')
            .cost(costs.payHonor(2))
            .target({
                cardType: CardType.Character
            }, placeFate());
    }
}


export default MasterOfJade;
