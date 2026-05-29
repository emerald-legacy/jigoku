import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class AdeptOfShadows extends DrawCard {
    static id = 'adept-of-shadows';

    setupCardAbilities() {
        this.action({
            title: 'Return to hand',
            cost: AbilityDsl.costs.payHonor(1),
            gameAction: AbilityDsl.actions.returnToHand()
        });
    }
}


export default AdeptOfShadows;
