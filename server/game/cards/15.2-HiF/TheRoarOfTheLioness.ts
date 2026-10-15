import { ProvinceCard } from '../../ProvinceCard.js';
import { modifyBaseProvinceStrength } from '../../effects.js';

export default class TheRoarOfTheLioness extends ProvinceCard {
    static id = 'the-roar-of-the-lioness';

    setupCardAbilities() {
        this.persistentEffect({
            effect: modifyBaseProvinceStrength((card) => Math.round(card.controller.honor / 2))
        });
    }
}
