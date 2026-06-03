import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Location } from '../../Constants.js';

class CeaselessDuty extends DrawCard {
    static id = 'ceaseless-duty';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Prevent a character from leaving play',
            when: {
                onCardLeavesPlay: (event, context) => event.card.type === CardType.Character && (event.card as DrawCard).costLessThan(context.player.getProvinces(a => !a.isBroken).length + 1) && event.card.location === Location.PlayArea
            },
            effect: 'prevent {1} from leaving play',
            effectArgs: context => context.event.card ?? '',
            cannotBeMirrored: true,
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}


export default CeaselessDuty;
