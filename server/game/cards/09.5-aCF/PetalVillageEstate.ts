import { modifyBothSkills } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class PetalVillageEstate extends DrawCard {
    static id = 'petal-village-estate';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card) => card.getType() === CardType.Character && card.hasTrait('imperial'),
            effect: modifyBothSkills(1)
        });
    }
}


export default PetalVillageEstate;
