import DrawCard from '../../DrawCard.js';
import { Duration, CardType, Phase } from '../../Constants.js';
import { reduceNextPlayedCardCost } from '../../effects.js';
import { multiple, playerLastingEffect } from '../../GameActions/GameActions.js';

class SakeHouseSmuggler extends DrawCard {
    static id = 'sake-house-smuggler';

    setupCardAbilities() {
        this.action('Reduce cost of next non-event card by 1')
            .gameAction(multiple([
                playerLastingEffect(context => ({
                    targetController: context.player,
                    duration: Duration.UntilEndOfPhase,
                    effect: reduceNextPlayedCardCost(1, (card) => card.type !== CardType.Event)
                })),
                playerLastingEffect(context => ({
                    duration: Duration.UntilEndOfPhase,
                    targetController: context.player.opponent,
                    effect: reduceNextPlayedCardCost(1, (card) => card.type !== CardType.Event)
                }))
            ]))
            .chatText('reduce the cost of each player\'s next non-event card by 1')
            .phase(Phase.Conflict);
    }
}


export default SakeHouseSmuggler;
