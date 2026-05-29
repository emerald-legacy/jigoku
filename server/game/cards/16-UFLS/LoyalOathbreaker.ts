import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class LoyalOathbreaker extends DrawCard {
    static id = 'loyal-oathbreaker';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.consideredLessHonorable()
        });
    }
}


export default LoyalOathbreaker;
