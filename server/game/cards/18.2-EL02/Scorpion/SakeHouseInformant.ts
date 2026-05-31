import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { FavorTypes } from '../../../Constants.js';

class SakeHouseInformant extends DrawCard {
    static id = 'sake-house-informant';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.game.getFavorSide() === FavorTypes.Military,
            match: card => card.hasTrait('shinobi'),
            effect: AbilityDsl.effects.modifyMilitarySkill(1)
        });

        this.persistentEffect({
            condition: context => context.game.getFavorSide() === FavorTypes.Political,
            match: card => card.hasTrait('shinobi'),
            effect: AbilityDsl.effects.modifyPoliticalSkill(1)
        });
    }
}


export default SakeHouseInformant;
