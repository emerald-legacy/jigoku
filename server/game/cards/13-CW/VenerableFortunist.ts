import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';

class VenerableFortunist extends DrawCard {
    static id = 'venerable-fortunist';

    setupCardAbilities() {
        this.action('Gain 2 fate')
            .cost(costs.returnRings(1, (ring, context) => (context.player.role?.getElement() ?? []).some((a) => ring.hasElement(a))))
            .condition((context) => !!context.player.role)
            .gainFate(2)
            .chatText('gain 2 fate');
    }
}


export default VenerableFortunist;
