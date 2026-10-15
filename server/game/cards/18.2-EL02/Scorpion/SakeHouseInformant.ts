import DrawCard from '../../../DrawCard.js';
import { modifyMilitarySkill, modifyPoliticalSkill } from '../../../effects.js';
import { FavorType, Trait } from '../../../Constants.js';

class SakeHouseInformant extends DrawCard {
    static id = 'sake-house-informant';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.game.getFavorSide() === FavorType.Military,
            match: (card) => card.hasTrait(Trait.Shinobi),
            effect: modifyMilitarySkill(1)
        });

        this.persistentEffect({
            condition: (context) => context.game.getFavorSide() === FavorType.Political,
            match: (card) => card.hasTrait(Trait.Shinobi),
            effect: modifyPoliticalSkill(1)
        });
    }
}


export default SakeHouseInformant;
