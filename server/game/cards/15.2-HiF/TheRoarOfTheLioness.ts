import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class TheRoarOfTheLioness extends ProvinceCard {
    static id = 'the-roar-of-the-lioness';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyBaseProvinceStrength((card: any) => Math.round(card.controller.honor / 2))
        });
    }
}
