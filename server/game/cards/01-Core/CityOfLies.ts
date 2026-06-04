import DrawCard from '../../DrawCard.js';
import { Duration, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class CityOfLies extends DrawCard {
    static id = 'city-of-lies';

    setupCardAbilities() {
        this.action({
            title: 'Reduce cost of next event by 1',
            effect: 'reduce the cost of their next event by 1',
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(1, (card: DrawCard) => card.type === CardType.Event)
            }))
        });
    }
}


export default CityOfLies;
