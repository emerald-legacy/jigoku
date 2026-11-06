import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { addFaction, addTrait } from '../../effects.js';

class SealOfTheCrab extends DrawCard {
    static id = 'seal-of-the-crab';

    override setupCardAbilities() {
        this.whileAttached({
            effect: [
                addFaction('crab'),
                addTrait(Trait.Berserker)
            ]
        });
    }
}


export default SealOfTheCrab;
