import DrawCard from '../../DrawCard.js';
import { addFaction, addTrait } from '../../effects.js';

class SealOfTheCrab extends DrawCard {
    static id = 'seal-of-the-crab';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                addFaction('crab'),
                addTrait('berserker')
            ]
        });
    }
}


export default SealOfTheCrab;
