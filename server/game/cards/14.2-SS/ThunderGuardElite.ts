import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';

class ThunderGuardElite extends DrawCard {
    static id = 'thunder-guard-elite';

    setupCardAbilities() {
        this.action('Opponent discards a random card')
            .cost(costs.payHonor(1))
            .condition((context) => context.source.isParticipating())
            .discardAtRandom();
    }
}


export default ThunderGuardElite;


