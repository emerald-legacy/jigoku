import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { perRound } from '../../AbilityLimit.js';

class WholenessOfTheWorld extends DrawCard {
    static id = 'wholeness-of-the-world';

    setupCardAbilities() {
        this.wouldInterrupt('Keep a claimed ring')
            .when({
                onReturnRing: (event, context) => event.ring.claimedBy === context.player.name
            })
            .cancel()
            .chatText((context) => msg`prevent ${context.event.ring} from returning to the unclaimed pool`)
            .max(perRound(1))
            .cannotBeMirrored();
    }
}


export default WholenessOfTheWorld;
