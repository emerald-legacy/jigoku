import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class VassalFields extends ProvinceCard {
    static id = 'vassal-fields';

    setupCardAbilities() {
        this.action({
            title: 'Make opponent lose 1 fate',
            gameAction: AbilityDsl.actions.loseFate()
        });
    }
}
