import { Players, Duration, Location } from '../../../Constants.js';
import { increaseLimitOnAbilities } from '../../../effects.js';
import { cardLastingEffect, multiple, ready } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class KayoTheShrinetender extends DrawCard {
    static id = 'kayo-the-shrinetender';

    setupCardAbilities() {
        this.action('Ready a Temple')
            .target({
                cardCondition: (card) => card.hasTrait('temple') && !card.facedown,
                controller: Players.Self,
                location: [Location.Provinces, Location.PlayArea]
            }, multiple([
                ready(),
                cardLastingEffect({
                    duration: Duration.UntilEndOfRound,
                    targetLocation: Location.Provinces,
                    effect: increaseLimitOnAbilities()
                })
            ]))
            .chatText('ready {0} and add an additional use to each of its abilities');
    }
}
