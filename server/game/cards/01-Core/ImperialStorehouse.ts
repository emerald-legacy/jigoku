import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { draw } from '../../GameActions/GameActions.js';

class ImperialStorehouse extends DrawCard {
    static id = 'imperial-storehouse';

    setupCardAbilities() {
        this.action('Draw a card')
            .cost(costs.sacrificeSelf())
            .gameAction(draw());
    }
}


export default ImperialStorehouse;
