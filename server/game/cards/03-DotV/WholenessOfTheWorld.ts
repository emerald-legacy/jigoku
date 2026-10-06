import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { cancel } from '../../GameActions/GameActions.js';

class WholenessOfTheWorld extends DrawCard {
    static id = 'wholeness-of-the-world';

    setupCardAbilities() {
        this.wouldInterrupt('Keep a claimed ring')
            .when({
                onReturnRing: (event, context) => event.ring.claimedBy === context.player.name
            })
            .gameAction(cancel())
            .effect('prevent {1} from returning to the unclaimed pool', context => context.event.ring)
            .max(AbilityDsl.limit.perRound(1))
            .cannotBeMirrored();
    }
}


export default WholenessOfTheWorld;
