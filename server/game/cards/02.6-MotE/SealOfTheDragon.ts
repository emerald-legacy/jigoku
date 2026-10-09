import DrawCard from '../../DrawCard.js';
import { addFaction, addTrait } from '../../effects.js';

class SealOfTheDragon extends DrawCard {
    static id = 'seal-of-the-dragon';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                addFaction('dragon'),
                addTrait('monk')
            ]
        });
    }
}


export default SealOfTheDragon;
