import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';

class AdeptOfShadows extends DrawCard {
    static id = 'adept-of-shadows';

    setupCardAbilities() {
        this.action('Return to hand')
            .cost(costs.payHonor(1))
            .returnToHand();
    }
}


export default AdeptOfShadows;
