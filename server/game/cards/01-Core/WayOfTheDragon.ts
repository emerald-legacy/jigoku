import DrawCard from '../../DrawCard.js';
import { increaseLimitOnAbilities } from '../../effects.js';

class WayOfTheDragon extends DrawCard {
    static id = 'way-of-the-dragon';

    setupCardAbilities() {
        this.attachmentConditions({
            limit: 1,
            myControl: true
        });

        this.whileAttached({
            effect: increaseLimitOnAbilities()
        });
    }
}


export default WayOfTheDragon;

