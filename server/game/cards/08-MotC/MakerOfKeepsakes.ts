import DrawCard from '../../DrawCard.js';
import { cannotReceiveDishonorToken } from '../../effects.js';

class MakerOfKeepsakes extends DrawCard {
    static id = 'maker-of-keepsakes';

    setupCardAbilities() {
        this.persistentEffect({
            effect: cannotReceiveDishonorToken()
        });
    }
}


export default MakerOfKeepsakes;
