import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { draw } from '../../GameActions/GameActions.js';

class FavoredNiece extends DrawCard {
    static id = 'favored-niece';

    setupCardAbilities() {
        this.action('Discard then draw a card')
            .cost(AbilityDsl.costs.discardCard({
                location: Location.Hand,
                targets: true
            }))
            .gameAction(draw())
            .limit(AbilityDsl.limit.perRound(2));
    }
}


export default FavoredNiece;
