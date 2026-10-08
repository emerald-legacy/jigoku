import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';

class TogashiInitiate extends DrawCard {
    static id = 'togashi-initiate';

    setupCardAbilities() {
        this.action('Honor this character')
            .cost(costs.payFateToRing(1))
            .condition((context) => context.source.isAttacking())
            .honor();
    }
}


export default TogashiInitiate;
