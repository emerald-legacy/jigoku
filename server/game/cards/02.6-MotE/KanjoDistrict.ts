import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class KanjoDistrict extends DrawCard {
    static id = 'kanjo-district';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Bow and send home a participating character')
            .cost(ability.costs.discardImperialFavor())
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, ability.actions.bow(), ability.actions.sendHome())
            .effect('bow and send {0} home');
    }
}


export default KanjoDistrict;
