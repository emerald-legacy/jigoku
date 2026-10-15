import { modifyBothSkills } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Trait } from '../../Constants.js';

class PetalVillageEstate extends DrawCard {
    static id = 'petal-village-estate';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card) => card.type === CardType.Character && card.hasTrait(Trait.Imperial),
            effect: modifyBothSkills(1)
        });
    }
}


export default PetalVillageEstate;
