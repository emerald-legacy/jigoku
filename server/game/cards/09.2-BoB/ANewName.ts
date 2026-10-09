import DrawCard from '../../DrawCard.js';
import { addTrait } from '../../effects.js';

class ANewName extends DrawCard {
    static id = 'a-new-name';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                addTrait('courtier'),
                addTrait('bushi')
            ]
        });
    }
}


export default ANewName;
