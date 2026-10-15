import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

class WorldlyShiotome extends DrawCard {
    static id = 'worldly-shiotome';

    setupCardAbilities() {
        this.reaction('Honor this character')
            .when({
                onCardPlayed: (event, context) => event.card.hasTrait(Trait.Gaijin) && event.player === context.player
            })
            .honor();
    }
}


export default WorldlyShiotome;
