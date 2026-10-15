import DrawCard from '../../DrawCard.js';
import { addFaction, addTrait } from '../../effects.js';

class SealOfTheScorpion extends DrawCard {
    static id = 'seal-of-the-scorpion';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                addFaction('scorpion'),
                addTrait('shinobi')
            ]
        });
    }
}


export default SealOfTheScorpion;
