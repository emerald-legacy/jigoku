import DrawCard from '../../DrawCard.js';
import { additionalCardPlayed } from '../../effects.js';

class ShintaoMonastery extends DrawCard {
    static id = 'shintao-monastery';

    override setupCardAbilities() {
        this.persistentEffect({
            effect: additionalCardPlayed(1)
        });
    }
}


export default ShintaoMonastery;
