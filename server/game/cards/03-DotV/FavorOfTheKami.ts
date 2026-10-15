import DrawCard from '../../DrawCard.js';
import { modifyGlory } from '../../effects.js';

class FavorOfTheKami extends DrawCard {
    static id = 'favor-of-the-kami';

    setupCardAbilities() {
        this.whileAttached({
            effect: modifyGlory(1)
        });
    }
}


export default FavorOfTheKami;
