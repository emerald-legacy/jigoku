import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { Location, CardType } from '../../Constants.js';

class KaiuSiegeForce extends DrawCard {
    static id = 'kaiu-siege-force';

    setupCardAbilities() {
        this.action('Ready this character')
            .cost(costs.returnToDeck({
                location: Location.Provinces,
                cardCondition: card => card.type === CardType.Holding,
                bottom: true
            }))
            .ready();
    }
}


export default KaiuSiegeForce;


