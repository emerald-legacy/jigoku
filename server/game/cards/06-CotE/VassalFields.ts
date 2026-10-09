import { ProvinceCard } from '../../ProvinceCard.js';

export default class VassalFields extends ProvinceCard {
    static id = 'vassal-fields';

    setupCardAbilities() {
        this.action('Make opponent lose 1 fate')
            .loseFate((context) => ({ target: context.player.opponent }));
    }
}
