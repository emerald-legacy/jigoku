import DrawCard from '../../DrawCard.js';
import { consideredLessHonorable } from '../../effects.js';

class LoyalOathbreaker extends DrawCard {
    static id = 'loyal-oathbreaker';

    override setupCardAbilities() {
        this.persistentEffect({
            effect: consideredLessHonorable()
        });
    }
}


export default LoyalOathbreaker;
