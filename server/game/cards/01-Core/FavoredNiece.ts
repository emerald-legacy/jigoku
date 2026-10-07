import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { perRound } from '../../AbilityLimit.js';

class FavoredNiece extends DrawCard {
    static id = 'favored-niece';

    setupCardAbilities() {
        this.action('Discard then draw a card')
            .cost(costs.discardCard({
                location: Location.Hand,
                targets: true
            }))
            .draw()
            .limit(perRound(2));
    }
}


export default FavoredNiece;
