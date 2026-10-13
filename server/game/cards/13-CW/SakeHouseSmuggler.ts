import DrawCard from '../../DrawCard.js';
import { Duration, CardType, Phase, Players } from '../../Constants.js';
import { reduceNextPlayedCardCost } from '../../effects.js';

class SakeHouseSmuggler extends DrawCard {
    static id = 'sake-house-smuggler';

    setupCardAbilities() {
        this.action('Reduce cost of next non-event card by 1')
            .playerLastingEffect({
                target: Players.Self,
                duration: Duration.UntilEndOfPhase,
                effect: reduceNextPlayedCardCost(1, (card) => card.type !== CardType.Event)
            })
            .playerLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                target: context.player.opponent,
                effect: reduceNextPlayedCardCost(1, (card) => card.type !== CardType.Event)
            }))
            .chatText('reduce the cost of each player\'s next non-event card by 1')
            .phase(Phase.Conflict);
    }
}


export default SakeHouseSmuggler;
