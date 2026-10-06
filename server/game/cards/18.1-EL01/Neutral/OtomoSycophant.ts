import DrawCard from '../../../DrawCard.js';
import { honor } from '../../../GameActions/GameActions.js';

class OtomoSycophant extends DrawCard {
    static id = 'otomo-sycophant';

    setupCardAbilities() {
        this.action('Honor Self')
            .condition(context => context.player.imperialFavor !== '')
            .gameAction(honor());
    }
}

export default OtomoSycophant;
