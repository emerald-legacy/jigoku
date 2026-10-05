import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ShosuroHametsu extends DrawCard {
    static id = 'shosuro-hametsu';

    setupCardAbilities() {
        this.action('Search conflict deck for a poison card')
            .cost(AbilityDsl.costs.payHonor(1))
            .gameAction(AbilityDsl.actions.deckSearch({
                cardCondition: card => card.hasTrait('poison'),
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Location.Hand
                })
            }))
            .effect('search conflict deck to reveal a poison card and add it to their hand');
    }
}


export default ShosuroHametsu;

