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
            .chatText('prevent {1} from returning to the unclaimed pool', (context) => context.event.ring)
            .max(perRound(1))
            .cannotBeMirrored();
    }
}


export default WholenessOfTheWorld;
