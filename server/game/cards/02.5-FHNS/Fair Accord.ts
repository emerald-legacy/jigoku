import DrawCard from '../../DrawCard.js';
import { Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FairAccord extends DrawCard {
    static id = 'fair-accord';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Discard favor to gain 2 fate')
            .cost(ability.costs.discardImperialFavor())
            .gameAction(ability.actions.gainFate({ amount: 2 }))
            .phase(Phases.Dynasty);
    }
}


export default FairAccord;
