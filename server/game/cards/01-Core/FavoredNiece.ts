import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FavoredNiece extends DrawCard {
    static id = 'favored-niece';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Discard then draw a card',
            limit: ability.limit.perRound(2),
            cost: ability.costs.discardCard({
                location: Location.Hand,
                targets: true
            }),
            gameAction: ability.actions.draw()
        });
    }
}


export default FavoredNiece;
