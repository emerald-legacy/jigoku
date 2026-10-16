import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { gainHonor, placeFateOnRing, selectRing, sequential } from '../../GameActions/GameActions.js';

class TranquilPhilosopher extends DrawCard {
    static id = 'tranquil-philosopher';

    override setupCardAbilities() {
        this.action('Move fate on rings')
            .ringTarget({
                activePromptTitle: 'Choose an unclaimed ring to move fate from',
                ringCondition: (ring) => ring.isUnclaimed() && ring.fate > 0
            }, sequential([
                selectRing((context) => ({
                    activePromptTitle: 'Choose an unclaimed ring to move fate to',
                    ringCondition: (ring) => ring.isUnclaimed() && ring !== context.ring,
                    message: (context, ring) => msg`${context.player} moves a fate from the ${context.ring} to the ${ring}`,
                    gameAction: placeFateOnRing({ origin: context.ring })
                })),
                gainHonor((context) => ({ target: context.player }))
            ]))
            .chatText((context) => msg`move 1 fate from the ${context.ring} to an unclaimed ring, then gain 1 honor`);
    }
}


export default TranquilPhilosopher;
