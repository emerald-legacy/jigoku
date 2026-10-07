import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { discardAtRandom } from '../../GameActions/GameActions.js';

class ThunderGuardElite extends DrawCard {
    static id = 'thunder-guard-elite';

    setupCardAbilities() {
        this.action('Opponent discards a random card')
            .cost(costs.payHonor(1))
            .condition(context => context.source.isParticipating())
            .gameAction(discardAtRandom());
    }
}


export default ThunderGuardElite;


