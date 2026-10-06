import { ProvinceCard } from '../../ProvinceCard.js';
import { loseFate } from '../../GameActions/GameActions.js';

export default class VassalFields extends ProvinceCard {
    static id = 'vassal-fields';

    setupCardAbilities() {
        this.action('Make opponent lose 1 fate')
            .gameAction(loseFate());
    }
}
