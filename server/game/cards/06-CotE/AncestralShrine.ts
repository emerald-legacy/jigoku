import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';

class AncestralShrine extends DrawCard {
    static id = 'ancestral-shrine';

    override setupCardAbilities() {
        this.action('Return rings to gain honor')
            .cost(costs.returnRings())
            .gainHonor((context) => ({
                // before the cost is paid, the action must still count as gaining honor
                amount: context.costs.returnedRings?.length ?? 1
            }));
    }
}


export default AncestralShrine;
