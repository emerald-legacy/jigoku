import DrawCard from '../../DrawCard.js';
import { Duration, CardType } from '../../Constants.js';
import { reduceNextPlayedCardCost } from '../../effects.js';

class CityOfLies extends DrawCard {
    static id = 'city-of-lies';

    setupCardAbilities() {
        this.action('Reduce cost of next event by 1')
            .playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: reduceNextPlayedCardCost(1, (card) => card.type === CardType.Event)
            }))
            .chatText('reduce the cost of their next event by 1');
    }
}


export default CityOfLies;
