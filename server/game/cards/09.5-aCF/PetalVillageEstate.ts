import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class PetalVillageEstate extends DrawCard {
    static id = 'petal-village-estate';

    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === CardTypes.Character && card.hasTrait('imperial'),
            effect: ability.effects.modifyBothSkills(1)
        });
    }
}


export default PetalVillageEstate;
