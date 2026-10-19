import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { playerCannot } from '../../effects.js';
import { nameCard, playerLastingEffect } from '../../GameActions/GameActions.js';
import { Duration, PlayType, Players, RestrictionScope } from '../../Constants.js';

class Gossip extends DrawCard {
    static id = 'gossip';

    override setupCardAbilities() {
        // naming is the effect, so it happens after the event could be cancelled (EmeraldDB ruling)
        this.action('Name a card that your opponent cannot play for the phase')
            .gameAction(nameCard({
                message: (_context, cardName, player) =>
                    msg`${player} names ${cardName} - ${player.opponent} cannot play cards named ${cardName} from their hand this phase`,
                gameAction: (cardName) => playerLastingEffect({
                    duration: Duration.UntilEndOfPhase,
                    target: Players.Opponent,
                    effect: playerCannot({
                        cannot: PlayType.PlayFromHand,
                        appliesTo: RestrictionScope.CopiesOfX,
                        params: cardName
                    })
                })
            }));
    }
}


export default Gossip;
