import * as costs from '../../costs/index.js';
import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { gainFate } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

class MantisSeafarer extends DrawCard {
    static id = 'mantis-seafarer';

    setupCardAbilities() {
        this.reaction('Gain a fate')
            .when({
                afterConflict: (event, context) => context.source.isParticipating() && event.conflict.winner === context.source.controller
            })
            .cost(costs.payHonor(1))
            .gameAction(gainFate())
            .limit(unlimitedPerConflict());
    }
}


export default MantisSeafarer;
