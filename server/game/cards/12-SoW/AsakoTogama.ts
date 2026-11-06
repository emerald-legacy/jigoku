import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { EventName } from '../../Constants.js';
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
                    ringCondition: (ring) => ring.isClaimedBy(context.player),
                    message: (context, ring) => msg`${context.player} returns the ${ring}`,
                    gameAction: returnRing()
                })),
                takeRing((context) => ({
                    target: context.ring,
                    takeFate: true,
                    conflictType: context.events.find((event) => event.is(EventName.OnReturnRing))?.ring?.conflictType
                })),
                chatMessage((context) => msg`${context.player} takes the ${context.ring}`)
            ]))
            .chatText('switch a claimed ring with an unclaimed one');
    }
}


export default AsakoTogama;
