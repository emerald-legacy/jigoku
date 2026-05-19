import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class FertileFields extends ProvinceCard {
    static id = 'fertile-fields';

    setupCardAbilities() {
        this.action({
            title: 'Draw a card',
            gameAction: AbilityDsl.actions.draw()
        });
    }
}
