import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';

class ThunderGuardElite extends DrawCard {
    static id = 'thunder-guard-elite';

    override setupCardAbilities() {
        this.action('Opponent discards a random card')
            .condition((context) => context.source.isParticipating())
            .cost(costs.payHonor(1))
            .discardAtRandom();
    }
}


export default ThunderGuardElite;


