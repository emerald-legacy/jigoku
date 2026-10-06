import DrawCard from '../../DrawCard.js';
import { discardAtRandom } from '../../GameActions/GameActions.js';

class RideAtDawn extends DrawCard {
    static id = 'ride-at-dawn';

    setupCardAbilities() {
        this.reaction('Make opponent discard a card')
            .when({
                onPassDuringDynasty: (event, context) => event.player === context.player && context.player.opponent && !context.player.opponent.passedDynasty
            })
            .gameAction(discardAtRandom());
    }
}


export default RideAtDawn;
