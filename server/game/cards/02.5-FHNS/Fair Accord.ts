import DrawCard from '../../DrawCard.js';
import { Phases } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { gainFate } from '../../GameActions/GameActions.js';

class FairAccord extends DrawCard {
    static id = 'fair-accord';

    setupCardAbilities() {
        this.action('Discard favor to gain 2 fate')
            .cost(costs.discardImperialFavor())
            .gameAction(gainFate({ amount: 2 }))
            .phase(Phases.Dynasty);
    }
}


export default FairAccord;
