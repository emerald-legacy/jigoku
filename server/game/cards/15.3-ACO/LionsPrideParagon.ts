import DrawCard from '../../DrawCard.js';
import { doesNotBow } from '../../effects.js';


class LionsPrideParagon extends DrawCard {
    static id = 'lion-s-pride-paragon';

    setupCardAbilities() {
        this.dire({
            effect: doesNotBow()
        });
    }
}


export default LionsPrideParagon;
