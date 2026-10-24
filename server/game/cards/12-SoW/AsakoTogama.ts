import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { chatMessage, joint, returnRing, selectRing, takeRing } from '../../GameActions/GameActions.js';

class AsakoTogama extends DrawCard {
    static id = 'asako-togama';

    override setupCardAbilities() {
        this.action('Switch a claimed ring with an unclaimed one')
            .condition((context) => context.source.isParticipating())
            .ringTarget({
                activePromptTitle: 'Choose a ring to take',
                ringCondition: (ring) => ring.isUnclaimed()
            }, joint([
                selectRing((context) => ({
                    activePromptTitle: 'Choose a ring to return',
                    ringCondition: (ring) => ring.claimedBy === context.player.name,
                    message: (context, ring) => msg`${context.player} returns the ${ring}`,
                    gameAction: returnRing()
                })),
                takeRing((context) => ({ target: context.ring, takeFate: true })),
                chatMessage((context) => msg`${context.player} takes the ${context.ring}`)
            ]))
            .chatText('switch a claimed ring with an unclaimed one');
    }
}


export default AsakoTogama;
