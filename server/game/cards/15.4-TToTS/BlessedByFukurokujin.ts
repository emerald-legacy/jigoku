import { cannotReceiveDishonorToken } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

class BlessedByFukurokujin extends DrawCard {
    static id = 'blessed-by-fukurokujin';

    setupCardAbilities() {
        this.whileAttached({
            effect: cannotReceiveDishonorToken()
        });
    }
}


export default BlessedByFukurokujin;
