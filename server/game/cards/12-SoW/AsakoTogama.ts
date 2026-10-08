import DrawCard from '../../DrawCard.js';
import { joint, returnRing, selectRing, takeRing } from '../../GameActions/GameActions.js';

class AsakoTogama extends DrawCard {
    static id = 'asako-togama';

    setupCardAbilities() {
        this.action('Switch a claimed ring with an unclaimed one')
            .condition((context) => context.source.isParticipating())
            .gameAction(joint([
                selectRing((context) => ({
                    activePromptTitle: 'Choose a ring to return',
                    ringCondition: (ring) => ring.claimedBy === context.player.name,
                    message: '{0} returns the {1}',
                    messageArgs: (ring) => [context.player, ring],
                    gameAction: returnRing()
                })),
                selectRing((context) => ({
                    activePromptTitle: 'Choose a ring to take',
                    ringCondition: (ring) => ring.isUnclaimed(),
                    message: '{0} takes the {1}',
                    messageArgs: (ring) => [context.player, ring],
                    gameAction: takeRing({ takeFate: true })
                }))
            ]))
            .chatText('switch a claimed ring with an unclaimed one');
    }
}


export default AsakoTogama;
