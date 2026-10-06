import DrawCard from '../../DrawCard.js';
import { Location, Duration, Players, CardType } from '../../Constants.js';
import { increaseLimitOnAbilities } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class KaiuInventor extends DrawCard {
    static id = 'kaiu-inventor';

    setupCardAbilities() {
        this.action('Add an additional ability use to a holding')
            .target({
                cardType: CardType.Holding,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: card => card.isFaceup()
            }, cardLastingEffect({
                duration: Duration.UntilEndOfRound,
                targetLocation: Location.Provinces,
                effect: increaseLimitOnAbilities()
            }))
            .effect('add an additional use to each of {0}\'s abilities');
    }
}


export default KaiuInventor;
