import DrawCard from '../../DrawCard.js';
import { Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { gainFate } from '../../GameActions/GameActions.js';

class FairAccord extends DrawCard {
    static id = 'fair-accord';

    setupCardAbilities() {
        this.action('Discard favor to gain 2 fate')
            .cost(AbilityDsl.costs.discardImperialFavor())
            .gameAction(gainFate({ amount: 2 }))
            .phase(Phases.Dynasty);
    }
}


export default FairAccord;
