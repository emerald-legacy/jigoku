import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { addFaction, addTrait } from '../../effects.js';

class SealOfTheUnicorn extends DrawCard {
    static id = 'seal-of-the-unicorn';

    override setupCardAbilities() {
        this.whileAttached({
            effect: [
                addFaction('unicorn'),
                addTrait(Trait.Cavalry)
            ]
        });
    }
}


export default SealOfTheUnicorn;
