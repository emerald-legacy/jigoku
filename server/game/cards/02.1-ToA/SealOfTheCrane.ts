import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { addFaction, addTrait } from '../../effects.js';

class SealOfTheCrane extends DrawCard {
    static id = 'seal-of-the-crane';

    override setupCardAbilities() {
        this.whileAttached({
            effect: [
                addFaction('crane'),
                addTrait(Trait.Duelist)
            ]
        });
    }
}


export default SealOfTheCrane;
