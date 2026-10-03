import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FavoredNiece extends DrawCard {
    static id = 'favored-niece';

    setupCardAbilities() {
        this.action('Discard then draw a card')
            .cost(AbilityDsl.costs.discardCard({
                location: Location.Hand,
                targets: true
            }))
            .gameAction(AbilityDsl.actions.draw())
            .limit(AbilityDsl.limit.perRound(2));
    }
}


export default FavoredNiece;
