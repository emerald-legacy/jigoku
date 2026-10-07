import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { gainFate } from '../../GameActions/GameActions.js';

class VenerableFortunist extends DrawCard {
    static id = 'venerable-fortunist';

    setupCardAbilities() {
        this.action('Gain 2 fate')
            .cost(costs.returnRings(1, (ring, context) => (context.player.role?.getElement() ?? []).some(a => ring.hasElement(a))))
            .condition(context => !!context.player.role)
            .gameAction(gainFate({ amount: 2}))
            .effect('gain 2 fate');
    }
}


export default VenerableFortunist;
