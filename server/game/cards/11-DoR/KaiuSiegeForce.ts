import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { ready } from '../../GameActions/GameActions.js';
import { Location, CardType } from '../../Constants.js';

class KaiuSiegeForce extends DrawCard {
    static id = 'kaiu-siege-force';

    setupCardAbilities() {
        this.action('Ready this character')
            .cost(AbilityDsl.costs.returnToDeck({
                location: Location.Provinces,
                cardCondition: card => card.type === CardType.Holding,
                bottom: true
            }))
            .gameAction(ready());
    }
}


export default KaiuSiegeForce;


