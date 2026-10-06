import DrawCard from '../../DrawCard.js';
import { gainHonor, placeFateOnRing, selectRing, sequential } from '../../GameActions/GameActions.js';

class TranquilPhilosopher extends DrawCard {
    static id = 'tranquil-philosopher';

    setupCardAbilities() {
        this.action('Move fate on rings')
            .ringTarget({
                activePromptTitle: 'Choose an unclaimed ring to move fate from',
                ringCondition: (ring) => ring.isUnclaimed()
            }, sequential([
                selectRing((context) => ({
                    activePromptTitle: 'Choose an unclaimed ring to move fate to',
                    ringCondition: (ring) => context.ring.fate > 0 && ring.isUnclaimed() && ring !== context.ring,
                    message: '{0} moves a fate from the {1} to the {2}',
                    messageArgs: (ring) => [context.player, context.ring, ring],
                    gameAction: placeFateOnRing({ origin: context.ring })
                })),
                gainHonor((context) => ({ target: context.player }))
            ]))
            .effect('{1}{2}{3}', (context) => (context.ring && context.ring.fate > 0) ?
                ['move 1 fate from the ', context.ring, ' to an unclaimed ring, then gain 1 honor'] :
                ['gain 1 honor', '', '']);
    }
}


export default TranquilPhilosopher;
