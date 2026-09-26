import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location } from '../../Constants.js';

class CeaselessDuty extends DrawCard {
    static id = 'ceaseless-duty';

    setupCardAbilities() {
        this.wouldInterrupt('Prevent a character from leaving play')
            .when({
                onCardLeavesPlay: (event, context) => event.card.isCharacter() && event.card.costLessThan(context.player.getProvinces(a => !a.isBroken).length + 1) && event.card.location === Location.PlayArea
            })
            .gameAction(AbilityDsl.actions.cancel())
            .effect('prevent {1} from leaving play', context => context.event.card ?? '')
            .cannotBeMirrored();
    }
}


export default CeaselessDuty;
