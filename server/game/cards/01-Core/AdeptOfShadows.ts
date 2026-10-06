import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { returnToHand } from '../../GameActions/GameActions.js';

class AdeptOfShadows extends DrawCard {
    static id = 'adept-of-shadows';

    setupCardAbilities() {
        this.action('Return to hand')
            .cost(AbilityDsl.costs.payHonor(1))
            .gameAction(returnToHand());
    }
}


export default AdeptOfShadows;
