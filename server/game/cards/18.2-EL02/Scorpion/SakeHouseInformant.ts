import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { FavorType } from '../../../Constants.js';

class SakeHouseInformant extends DrawCard {
    static id = 'sake-house-informant';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.game.getFavorSide() === FavorType.Military,
            match: (card: DrawCard) => card.hasTrait('shinobi'),
            effect: AbilityDsl.effects.modifyMilitarySkill(1)
        });

        this.persistentEffect({
            condition: context => context.game.getFavorSide() === FavorType.Political,
            match: (card: DrawCard) => card.hasTrait('shinobi'),
            effect: AbilityDsl.effects.modifyPoliticalSkill(1)
        });
    }
}


export default SakeHouseInformant;
