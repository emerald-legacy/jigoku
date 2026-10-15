import DrawCard from '../../DrawCard.js';
import { addFaction, addTrait } from '../../effects.js';

class SealOfTheUnicorn extends DrawCard {
    static id = 'seal-of-the-unicorn';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                addFaction('unicorn'),
                addTrait('cavalry')
            ]
        });
    }
}


export default SealOfTheUnicorn;
