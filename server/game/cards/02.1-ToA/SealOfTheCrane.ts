import DrawCard from '../../DrawCard.js';
import { addFaction, addTrait } from '../../effects.js';

class SealOfTheCrane extends DrawCard {
    static id = 'seal-of-the-crane';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                addFaction('crane'),
                addTrait('duelist')
            ]
        });
    }
}


export default SealOfTheCrane;
