import DrawCard from '../../drawcard.js';
import { Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FairAccord extends DrawCard {
    static id = 'fair-accord';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Discard favor to gain 2 fate',
            phase: Phases.Dynasty,
            cost: ability.costs.discardImperialFavor(),
            gameAction: ability.actions.gainFate({ amount: 2 })
        });
    }
}


export default FairAccord;
