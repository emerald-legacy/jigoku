import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { addFaction, addTrait } from '../../effects.js';

class SealOfTheScorpion extends DrawCard {
    static id = 'seal-of-the-scorpion';

    override setupCardAbilities() {
        this.whileAttached({
            effect: [
                addFaction('scorpion'),
                addTrait(Trait.Shinobi)
            ]
        });
    }
}


export default SealOfTheScorpion;
