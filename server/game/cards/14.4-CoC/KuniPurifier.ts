import DrawCard from '../../DrawCard.js';
import { discardAtRandom } from '../../GameActions/GameActions.js';

class KuniPurifier extends DrawCard {
    static id = 'kuni-purifier';

    setupCardAbilities() {
        this.reaction('Make opponent discard a random card')
            .when({
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player.opponent
            })
            .gameAction(discardAtRandom());
    }
}


export default KuniPurifier;
