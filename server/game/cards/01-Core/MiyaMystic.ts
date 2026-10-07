import DrawCard from '../../DrawCard.js';
import { Phases, CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';

class MiyaMystic extends DrawCard {
    static id = 'miya-mystic';

    setupCardAbilities() {
        this.action('Sacrifice to discard an attachment')
            .cost(costs.sacrificeSelf())
            .target({
                cardType: CardType.Attachment
            }, discardFromPlay())
            .phase(Phases.Conflict);
    }
}


export default MiyaMystic;


