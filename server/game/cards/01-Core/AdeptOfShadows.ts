import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { returnToHand } from '../../GameActions/GameActions.js';

class AdeptOfShadows extends DrawCard {
    static id = 'adept-of-shadows';

    setupCardAbilities() {
        this.action('Return to hand')
            .cost(costs.payHonor(1))
            .gameAction(returnToHand());
    }
}


export default AdeptOfShadows;
