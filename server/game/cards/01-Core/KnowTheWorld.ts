import { msg } from '../../GameChat.js';
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
                    message: (context, ring) => msg`${context.player} returns ${ring}`,
                    gameAction: returnRing()
                })),
                selectRing({
                    activePromptTitle: 'Choose a ring to take',
                    ringCondition: (ring) => ring.isUnclaimed(),
                    message: (context, ring) => msg`${context.player} takes ${ring}`,
                    gameAction: takeRing({ takeFate: true })
                })
            ]))
            .chatText('switch a claimed ring with an unclaimed one');
    }
}


export default KnowTheWorld;
