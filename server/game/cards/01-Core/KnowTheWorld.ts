import DrawCard from '../../DrawCard.js';
import { joint, returnRing, selectRing, takeRing } from '../../GameActions/GameActions.js';

class KnowTheWorld extends DrawCard {
    static id = 'know-the-world';

    setupCardAbilities() {
        this.action('Switch a claimed ring with an unclaimed one')
            .gameAction(joint([
                selectRing((context) => ({
                    activePromptTitle: 'Choose a ring to return',
                    ringCondition: (ring) => ring.claimedBy === context.player.name,
                    message: '{0} returns {1}',
                    messageArgs: (ring) => [context.player, ring],
                    gameAction: returnRing()
                })),
                selectRing((context) => ({
                    activePromptTitle: 'Choose a ring to take',
                    ringCondition: (ring) => ring.isUnclaimed(),
                    message: '{0} takes {1}',
                    messageArgs: (ring) => [context.player, ring],
                    gameAction: takeRing({ takeFate: true })
                }))
            ]))
            .chatText('switch a claimed ring with an unclaimed one');
    }
}


export default KnowTheWorld;
