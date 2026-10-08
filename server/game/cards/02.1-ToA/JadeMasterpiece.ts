import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { placeFateOnRing, selectRing } from '../../GameActions/GameActions.js';

class JadeMasterpiece extends DrawCard {
    static id = 'jade-masterpiece';

    setupCardAbilities() {
        this.action('Move a fate to an unclaimed ring')
            .cost(costs.bowSelf())
            .ringTarget({
                activePromptTitle: 'Choose an unclaimed ring to move fate from',
                ringCondition: ring => ring.isUnclaimed() && ring.fate > 0
            }, selectRing(context => ({
                activePromptTitle: 'Choose an unclaimed ring to move fate to',
                ringCondition: ring => ring.isUnclaimed() && ring !== context.ring,
                message: '{0} moves a fate from {1} to {2}',
                messageArgs: ring => [context.player, context.ring, ring],
                gameAction: placeFateOnRing({ origin: context.ring })
            })))
            .chatText('move 1 fate from {0} to an unclaimed ring');
    }
}


export default JadeMasterpiece;
