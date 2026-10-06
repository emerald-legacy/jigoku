import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { discardAtRandom } from '../../GameActions/GameActions.js';

class ThunderGuardElite extends DrawCard {
    static id = 'thunder-guard-elite';

    setupCardAbilities() {
        this.action('Opponent discards a random card')
            .cost(AbilityDsl.costs.payHonor(1))
            .condition(context => context.source.isParticipating())
            .gameAction(discardAtRandom());
    }
}


export default ThunderGuardElite;


