import { addKeyword, cardCannot } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { RestrictionType } from '../../Constants.js';

class ShapeTheFlesh extends DrawCard {
    static id = 'shape-the-flesh';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                cardCannot(RestrictionType.Honor),
                addKeyword('covert')
            ]
        });
    }

    isTemptationsMaho() {
        return true;
    }
}


export default ShapeTheFlesh;

