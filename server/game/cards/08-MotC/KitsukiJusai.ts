import DrawCard from '../../DrawCard.js';
import { placeFateOnRing, selectRing } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class KitsukiJusai extends DrawCard {
    static id = 'kitsuki-jusai';

    setupCardAbilities() {
        this.reaction('Put a fate from your opponent pool on an unclaimed ring')
            .when({
                onHonorDialsRevealed: (_event, context) =>
                    context.player.opponent &&
                    context.player.honorBid === context.player.opponent.honorBid &&
                    context.player.opponent.fate > 0
            })
            .gameAction(selectRing(context => ({
                activePromptTitle: 'Choose an unclaimed ring to move fate to',
                ringCondition: ring => ring.isUnclaimed(),
                message: '{0} moves a fate from {1}\'s fate pool to the {2}',
                messageArgs: ring => [context.player, context.player.opponent, ring],
                gameAction: placeFateOnRing({ origin: context.player.opponent })
            })))
            .chatText((context) => msg`move 1 fate from ${context.player.opponent ?? context.player}'s fate pool to an unclaimed ring`);
    }
}


export default KitsukiJusai;
