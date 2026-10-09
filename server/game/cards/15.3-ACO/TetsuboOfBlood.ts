import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';
import { RestrictionType } from '../../Constants.js';

class TetsuboOfBlood extends DrawCard {
    static id = 'tetsubo-of-blood';

    setupCardAbilities() {
        this.whileAttached({
            effect: cardCannot(RestrictionType.Honor)
        });
    }

    isTemptationsMaho() {
        return true;
    }
}


export default TetsuboOfBlood;
