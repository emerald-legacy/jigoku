import DrawCard from '../../DrawCard.js';
import { Phase } from '../../Constants.js';
import * as costs from '../../costs/index.js';

class FairAccord extends DrawCard {
    static id = 'fair-accord';

    override setupCardAbilities() {
        this.action('Discard favor to gain 2 fate')
            .phase(Phase.Dynasty)
            .cost(costs.discardImperialFavor())
            .gainFate(2);
    }
}


export default FairAccord;
