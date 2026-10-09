import DrawCard from '../../DrawCard.js';
import { consideredLessHonorable } from '../../effects.js';

class LoyalOathbreaker extends DrawCard {
    static id = 'loyal-oathbreaker';

    setupCardAbilities() {
        this.persistentEffect({
            effect: consideredLessHonorable()
        });
    }
}


export default LoyalOathbreaker;
