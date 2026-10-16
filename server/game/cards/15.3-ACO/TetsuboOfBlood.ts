import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';
import { RestrictionType } from '../../Constants.js';

class TetsuboOfBlood extends DrawCard {
    static id = 'tetsubo-of-blood';

    override setupCardAbilities() {
        this.whileAttached({
            effect: cardCannot(RestrictionType.Honor)
        });
    }

    override isTemptationsMaho() {
        return true;
    }
}


export default TetsuboOfBlood;
