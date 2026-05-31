import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, CardTypes } from '../../Constants.js';

class KaiuSiegeForce extends DrawCard {
    static id = 'kaiu-siege-force';

    setupCardAbilities() {
        this.action({
            title: 'Ready this character',
            cost: AbilityDsl.costs.returnToDeck({
                location: Locations.Provinces,
                cardCondition: card => card.type === CardTypes.Holding,
                bottom: true
            }),
            gameAction: AbilityDsl.actions.ready()
        });
    }
}


export default KaiuSiegeForce;


