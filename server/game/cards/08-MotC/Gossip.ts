import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Duration, PlayType, Players } from '../../Constants.js';

class Gossip extends DrawCard {
    static id = 'gossip';

    setupCardAbilities() {
        this.action('Name a card that your opponent cannot play for the phase')
            .cost(AbilityDsl.costs.nameCard())
            .gameAction(AbilityDsl.actions.playerLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                targetController: Players.Opponent,
                effect: AbilityDsl.effects.playerCannot({
                    cannot: PlayType.PlayFromHand,
                    restricts: 'copiesOfX',
                    params: context.costs.nameCardCost
                })
            })))
            .effect('prevent {1} from playing cards named {2} from their hand this phase', (context) => [context.player.opponent, context.costs.nameCardCost]);
    }
}

export default Gossip;
