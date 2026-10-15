import { ProvinceCard } from '../../ProvinceCard.js';
import { modifyBaseProvinceStrength } from '../../effects.js';

export default class WebOfLies extends ProvinceCard {
    static id = 'web-of-lies';

    setupCardAbilities() {
        this.persistentEffect({
            effect: modifyBaseProvinceStrength((card) => card.controller.showBid * 2)
        });
    }
}
