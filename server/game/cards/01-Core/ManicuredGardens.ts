import { ProvinceCard } from '../../ProvinceCard.js';
import { gainFate } from '../../GameActions/GameActions.js';

export default class ManicuredGarden extends ProvinceCard {
    static id = 'manicured-garden';

    setupCardAbilities() {
        this.action('Gain 1 fate')
            .gameAction(gainFate());
    }
}
