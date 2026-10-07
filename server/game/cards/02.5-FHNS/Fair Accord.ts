import DrawCard from '../../DrawCard.js';
import { Phases } from '../../Constants.js';
import * as costs from '../../costs/index.js';

class FairAccord extends DrawCard {
    static id = 'fair-accord';

    setupCardAbilities() {
        this.action('Discard favor to gain 2 fate')
            .cost(costs.discardImperialFavor())
            .gainFate(2)
            .phase(Phases.Dynasty);
    }
}


export default FairAccord;
