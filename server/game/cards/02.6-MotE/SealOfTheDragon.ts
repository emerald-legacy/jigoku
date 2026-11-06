import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { addFaction, addTrait } from '../../effects.js';

class SealOfTheDragon extends DrawCard {
    static id = 'seal-of-the-dragon';

    override setupCardAbilities() {
        this.whileAttached({
            effect: [
                addFaction('dragon'),
                addTrait(Trait.Monk)
            ]
        });
    }
}


export default SealOfTheDragon;
