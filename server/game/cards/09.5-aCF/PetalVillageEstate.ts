import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class PetalVillageEstate extends DrawCard {
    static id = 'petal-village-estate';

    setupCardAbilities() {
        this.persistentEffect({
            match: card => card.getType() === CardType.Character && card.hasTrait('imperial'),
            effect: AbilityDsl.effects.modifyBothSkills(1)
        });
    }
}


export default PetalVillageEstate;
