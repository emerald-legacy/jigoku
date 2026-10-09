import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { playerCannot } from '../../effects.js';
import { Duration, PlayType, Players, RestrictionScope } from '../../Constants.js';

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
                    appliesTo: RestrictionScope.CopiesOfX,
                    params: context.costs.namedCard
                })
            }))
            .chatText((context) => msg`prevent ${context.player.opponent} from playing cards named ${context.costs.namedCard} from their hand this phase`);
    }
}

export default Gossip;
