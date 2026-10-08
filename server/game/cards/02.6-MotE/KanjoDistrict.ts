import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { bow, sendHome } from '../../GameActions/GameActions.js';

class KanjoDistrict extends DrawCard {
    static id = 'kanjo-district';

    setupCardAbilities() {
        this.action('Bow and send home a participating character')
            .cost(costs.discardImperialFavor())
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, bow(), sendHome())
            .chatText('bow and send {0} home');
    }
}


export default KanjoDistrict;
