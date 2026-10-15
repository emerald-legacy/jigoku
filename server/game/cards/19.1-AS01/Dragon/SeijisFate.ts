import { addTrait, blank, loseTrait } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class SeijisFate extends DrawCard {
    static id = 'seiji-s-fate';

    public setupCardAbilities() {
        this.whileAttached({
            effect: [
                addTrait('creature'),
                loseTrait('bushi'),
                loseTrait('courtier'),
                blank()
            ]
        });
    }
}
