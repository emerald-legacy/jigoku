import { Trait } from '../../../Constants.js';
import { addTrait, blank, loseTrait } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class SeijisFate extends DrawCard {
    static id = 'seiji-s-fate';

    public override setupCardAbilities() {
        this.whileAttached({
            effect: [
                addTrait(Trait.Creature),
                loseTrait(Trait.Bushi),
                loseTrait(Trait.Courtier),
                blank()
            ]
        });
    }
}
