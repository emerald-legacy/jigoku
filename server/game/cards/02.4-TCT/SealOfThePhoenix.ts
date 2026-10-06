import DrawCard from '../../DrawCard.js';
import { addFaction, addTrait } from '../../effects.js';

class SealOfThePhoenix extends DrawCard {
    static id = 'seal-of-the-phoenix';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                addFaction('phoenix'),
                addTrait('scholar')
            ]
        });
    }
}


export default SealOfThePhoenix;
