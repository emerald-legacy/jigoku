import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { addFaction, addTrait } from '../../effects.js';

class SealOfThePhoenix extends DrawCard {
    static id = 'seal-of-the-phoenix';

    override setupCardAbilities() {
        this.whileAttached({
            effect: [
                addFaction('phoenix'),
                addTrait(Trait.Scholar)
            ]
        });
    }
}


export default SealOfThePhoenix;
