import { addKeyword, cardCannot } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

class ShapeTheFlesh extends DrawCard {
    static id = 'shape-the-flesh';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                cardCannot('honor'),
                addKeyword('covert')
            ]
        });
    }

    isTemptationsMaho() {
        return true;
    }
}


export default ShapeTheFlesh;

