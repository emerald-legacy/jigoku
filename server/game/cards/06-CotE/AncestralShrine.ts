import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';

class AncestralShrine extends DrawCard {
    static id = 'ancestral-shrine';

    setupCardAbilities() {
        this.action('Return rings to gain honor')
            .cost(costs.returnRings())
            .gainHonor(context => ({
                amount: context.costs.returnRing ? context.costs.returnRing.length : 1
            }));
    }
}


export default AncestralShrine;
