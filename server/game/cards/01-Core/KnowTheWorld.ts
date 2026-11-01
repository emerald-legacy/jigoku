import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { EventName } from '../../Constants.js';
import { joint, returnRing, selectRing, takeRing } from '../../GameActions/GameActions.js';

class KnowTheWorld extends DrawCard {
    static id = 'know-the-world';

    override setupCardAbilities() {
        this.action('Switch a claimed ring with an unclaimed one')
            .gameAction(joint([
                selectRing((context) => ({
                    activePromptTitle: 'Choose a ring to return',
                    ringCondition: (ring) => ring.isClaimedBy(context.player),
                    message: (context, ring) => msg`${context.player} returns ${ring}`,
                    gameAction: returnRing()
                })),
                selectRing({
                    activePromptTitle: 'Choose a ring to take',
                    ringCondition: (ring) => ring.isUnclaimed(),
                    message: (context, ring) => msg`${context.player} takes ${ring}`,
                    // the taken ring keeps the returned ring's conflict type
                    gameAction: takeRing((context) => ({
                        takeFate: true,
                        conflictType: context.events.find((event) => event.is(EventName.OnReturnRing))?.ring?.conflictType
                    }))
                })
            ]))
            .chatText('switch a claimed ring with an unclaimed one');
    }
}


export default KnowTheWorld;
