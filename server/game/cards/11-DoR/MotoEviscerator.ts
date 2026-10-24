import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';

class MotoEviscerator extends DrawCard {
    static id = 'moto-eviscerator';

    override setupCardAbilities() {
        this.action('Move this character to conflict')
            .cost(costs.payHonor(1))
            .moveToConflict();
    }
}


export default MotoEviscerator;
