import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class KanjoDistrict extends DrawCard {
    static id = 'kanjo-district';

    setupCardAbilities() {
        this.action('Bow and send home a participating character')
            .cost(AbilityDsl.costs.discardImperialFavor())
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, AbilityDsl.actions.bow(), AbilityDsl.actions.sendHome())
            .effect('bow and send {0} home');
    }
}


export default KanjoDistrict;
