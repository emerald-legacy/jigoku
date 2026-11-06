import * as costs from '../../costs/index.js';
import { unlimited } from '../../AbilityLimit.js';
import DrawCard from '../../DrawCard.js';

class MantisSeafarer extends DrawCard {
    static id = 'mantis-seafarer';

    override setupCardAbilities() {
        this.reaction('Gain a fate')
            .when({
                afterConflict: (event, context) => event.conflict.isOnWinningSide(context.source)
            })
            .cost(costs.payHonor(1))
            .gainFate()
            .limit(unlimited());
    }
}


export default MantisSeafarer;
