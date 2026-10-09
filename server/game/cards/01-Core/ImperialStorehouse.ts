import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';

class ImperialStorehouse extends DrawCard {
    static id = 'imperial-storehouse';

    setupCardAbilities() {
        this.action('Draw a card')
            .cost(costs.sacrificeSelf())
            .draw();
    }
}


export default ImperialStorehouse;
