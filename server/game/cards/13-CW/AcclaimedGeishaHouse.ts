import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { switchConflictElement } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';

class AcclaimedGeishaHouse extends DrawCard {
    static id = 'acclaimed-geisha-house';

    setupCardAbilities() {
        this.action('Switch the contested ring')
            .cost(AbilityDsl.costs.dishonor({ cardType: CardType.Character, cardCondition: card => card.isParticipating() }))
            .ringTarget({
                activePromptTitle: 'Choose an unclaimed ring',
                ringCondition: ring => ring.isUnclaimed()
            }, switchConflictElement())
            .effect('switch the contested ring with the {0}');
    }
}


export default AcclaimedGeishaHouse;
