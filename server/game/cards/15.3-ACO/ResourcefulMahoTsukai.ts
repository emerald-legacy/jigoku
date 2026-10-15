import DrawCard from '../../DrawCard.js';
import { reduceCost } from '../../effects.js';

class ResourcefulMahoTsukai extends DrawCard {
    static id = 'resourceful-maho-tsukai';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isDishonored,
            effect: reduceCost({
                match: (card) => card.hasTrait('maho')
            })
        });
    }
}


export default ResourcefulMahoTsukai;
