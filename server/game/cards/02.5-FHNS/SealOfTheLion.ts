import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { addFaction, addTrait } from '../../effects.js';

class SealOfTheLion extends DrawCard {
    static id = 'seal-of-the-lion';

    override setupCardAbilities() {
        this.whileAttached({
            effect: [
                addFaction('lion'),
                addTrait(Trait.Commander)
            ]
        });
    }
}


export default SealOfTheLion;
