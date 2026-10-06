import DrawCard from '../../DrawCard.js';
import { addFaction, addTrait } from '../../effects.js';

class SealOfTheLion extends DrawCard {
    static id = 'seal-of-the-lion';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                addFaction('lion'),
                addTrait('commander')
            ]
        });
    }
}


export default SealOfTheLion;
