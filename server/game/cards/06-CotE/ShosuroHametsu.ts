import DrawCard from '../../DrawCard.js';
import { Location, Trait } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { moveCard } from '../../GameActions/GameActions.js';

class ShosuroHametsu extends DrawCard {
    static id = 'shosuro-hametsu';

    override setupCardAbilities() {
        this.action('Search conflict deck for a poison card')
            .cost(costs.payHonor(1))
            .deckSearch({
                cardCondition: (card) => card.hasTrait(Trait.Poison),
                gameAction: moveCard({
                    destination: Location.Hand
                })
            })
            .chatText('search conflict deck to reveal a poison card and add it to their hand');
    }
}


export default ShosuroHametsu;

