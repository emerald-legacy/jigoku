import DrawCard from '../../DrawCard.js';
import { Phase, CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';

class MiyaMystic extends DrawCard {
    static id = 'miya-mystic';

    override setupCardAbilities() {
        this.action('Sacrifice to discard an attachment')
            .phase(Phase.Conflict)
            .cost(costs.sacrificeSelf())
            .target({
                cardType: CardType.Attachment
            }, discardFromPlay());
    }
}


export default MiyaMystic;


