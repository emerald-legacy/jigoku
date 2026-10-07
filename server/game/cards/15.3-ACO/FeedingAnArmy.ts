import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { Phases } from '../../Constants.js';

class FeedingAnArmy extends DrawCard {
    static id = 'feeding-an-army';

    setupCardAbilities() {
        this.reaction('Put fate on characters')
            .when({
                onPhaseStarted: (event) => event.phase === Phases.Conflict
            })
            .cost(costs.breakProvince({ cardCondition: (card) => card.isFaceup() }))
            .placeFate((context) => ({
                target: context.player.cardsInPlay.filter((card) => card.costLessThan(4))
            }));
    }
}


export default FeedingAnArmy;
