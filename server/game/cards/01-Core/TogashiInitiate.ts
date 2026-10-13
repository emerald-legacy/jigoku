import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';

class TogashiInitiate extends DrawCard {
    static id = 'togashi-initiate';

    setupCardAbilities() {
        this.action('Honor this character')
            .condition((context) => context.source.isAttacking())
            .cost(costs.payFateToRing(1))
            .honor();
    }
}


export default TogashiInitiate;
