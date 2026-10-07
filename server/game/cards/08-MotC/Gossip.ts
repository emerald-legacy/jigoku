import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { playerCannot } from '../../effects.js';
import { Duration, PlayType, Players } from '../../Constants.js';

class Gossip extends DrawCard {
    static id = 'gossip';

    setupCardAbilities() {
        this.action('Name a card that your opponent cannot play for the phase')
            .cost(costs.nameCard())
            .playerLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                targetController: Players.Opponent,
                effect: playerCannot({
                    cannot: PlayType.PlayFromHand,
                    restricts: 'copiesOfX',
                    params: context.costs.nameCardCost
                })
            }))
            .effect('prevent {1} from playing cards named {2} from their hand this phase', (context) => [context.player.opponent, context.costs.nameCardCost]);
    }
}

export default Gossip;
