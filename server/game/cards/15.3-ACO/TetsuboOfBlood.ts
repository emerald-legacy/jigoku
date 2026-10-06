import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';

class TetsuboOfBlood extends DrawCard {
    static id = 'tetsubo-of-blood';

    setupCardAbilities() {
        this.whileAttached({
            effect: cardCannot('honor')
        });
    }

    isTemptationsMaho() {
        return true;
    }
}


export default TetsuboOfBlood;
