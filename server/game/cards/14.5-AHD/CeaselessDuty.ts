import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';

class CeaselessDuty extends DrawCard {
    static id = 'ceaseless-duty';

    setupCardAbilities() {
        this.wouldInterrupt('Prevent a character from leaving play')
            .when({
                onCardLeavesPlay: (event, context) => event.card.isCharacter() && event.card.costLessThan(context.player.getProvinces((a) => !a.isBroken).length + 1) && event.card.location === Location.PlayArea
            })
            .cancel()
            .chatText((context) => msg`prevent ${context.event.card} from leaving play`)
            .cannotBeMirrored();
    }
}


export default CeaselessDuty;
