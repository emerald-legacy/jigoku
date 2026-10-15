import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { addTrait } from '../../effects.js';

class ANewName extends DrawCard {
    static id = 'a-new-name';

    override setupCardAbilities() {
        this.whileAttached({
            effect: [
                addTrait(Trait.Courtier),
                addTrait(Trait.Bushi)
            ]
        });
    }
}


export default ANewName;
