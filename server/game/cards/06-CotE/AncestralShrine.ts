import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { gainHonor } from '../../GameActions/GameActions.js';

class AncestralShrine extends DrawCard {
    static id = 'ancestral-shrine';

    setupCardAbilities() {
        this.action('Return rings to gain honor')
            .cost(AbilityDsl.costs.returnRings())
            .gameAction(gainHonor(context => ({
                amount: context.costs.returnRing ? context.costs.returnRing.length : 1
            })));
    }
}


export default AncestralShrine;
