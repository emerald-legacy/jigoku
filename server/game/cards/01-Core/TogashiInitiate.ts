import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { honor } from '../../GameActions/GameActions.js';

class TogashiInitiate extends DrawCard {
    static id = 'togashi-initiate';

    setupCardAbilities() {
        this.action('Honor this character')
            .cost(AbilityDsl.costs.payFateToRing(1))
            .condition(context => context.source.isAttacking())
            .gameAction(honor());
    }
}


export default TogashiInitiate;
