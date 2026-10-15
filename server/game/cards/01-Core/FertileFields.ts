import { ProvinceCard } from '../../ProvinceCard.js';

export default class FertileFields extends ProvinceCard {
    static id = 'fertile-fields';

    setupCardAbilities() {
        this.action('Draw a card')
            .draw();
    }
}
