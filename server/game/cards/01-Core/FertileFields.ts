import { ProvinceCard } from '../../ProvinceCard.js';
import { draw } from '../../GameActions/GameActions.js';

export default class FertileFields extends ProvinceCard {
    static id = 'fertile-fields';

    setupCardAbilities() {
        this.action('Draw a card')
            .gameAction(draw());
    }
}
