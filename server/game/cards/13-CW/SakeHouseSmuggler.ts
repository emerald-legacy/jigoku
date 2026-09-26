import DrawCard from '../../DrawCard.js';
import { Duration, CardType, Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SakeHouseSmuggler extends DrawCard {
    static id = 'sake-house-smuggler';

    setupCardAbilities() {
        this.action('Reduce cost of next non-event card by 1')
            .gameAction(AbilityDsl.actions.multiple([
                AbilityDsl.actions.playerLastingEffect(context => ({
                    targetController: context.player,
                    duration: Duration.UntilEndOfPhase,
                    effect: AbilityDsl.effects.reduceNextPlayedCardCost(1, (card: DrawCard) => card.type !== CardType.Event)
                })),
                AbilityDsl.actions.playerLastingEffect(context => ({
                    duration: Duration.UntilEndOfPhase,
                    targetController: context.player.opponent,
                    effect: AbilityDsl.effects.reduceNextPlayedCardCost(1, (card: DrawCard) => card.type !== CardType.Event)
                }))
            ]))
            .effect('reduce the cost of each player\'s next non-event card by 1')
            .phase(Phases.Conflict);
    }
}


export default SakeHouseSmuggler;
