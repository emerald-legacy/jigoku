import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { draw } from '../../GameActions/GameActions.js';

class FuneralPyre extends DrawCard {
    static id = 'funeral-pyre';

    setupCardAbilities() {
        this.action('Sacrifice a character to draw')
            .cost(costs.sacrifice({ cardType: CardType.Character }))
            .gameAction(draw());
    }
}


export default FuneralPyre;
