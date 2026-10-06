import DrawCard from '../../DrawCard.js';
import { honor } from '../../GameActions/GameActions.js';

class WorldlyShiotome extends DrawCard {
    static id = 'worldly-shiotome';

    setupCardAbilities() {
        this.reaction('Honor this character')
            .when({
                onCardPlayed: (event, context) => event.card.hasTrait('gaijin') && event.player === context.player
            })
            .gameAction(honor());
    }
}


export default WorldlyShiotome;
