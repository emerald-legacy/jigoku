import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { CardType } from '../../Constants.js';

class ForgedEdict extends DrawCard {
    static id = 'forged-edict';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel an event')
            .when({
                onInitiateAbilityEffects: event => event.card.type === CardType.Event
            })
            .cost(costs.dishonor({ cardCondition: card => card.hasTrait('courtier') }))
            .cancel()
            .cannotBeMirrored();
    }
}


export default ForgedEdict;
