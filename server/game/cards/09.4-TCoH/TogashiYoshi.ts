import DrawCard from '../../DrawCard.js';
import { takeFateFromRing } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class TogashiYoshi extends DrawCard {
    static id = 'togashi-yoshi';

    override setupCardAbilities() {
        this.reaction('Gain 1 fate from an unclaimed ring')
            .when({
                afterConflict: (event, context) => event.conflict.isOnWinningSide(context.source)
            })
            .selectRing({
                ringCondition: (ring) => ring.fate >= 1 && ring.isUnclaimed(),
                message: (context, ring) => msg`${context.player} takes 1 fate from ${ring}`,
                gameAction: takeFateFromRing()
            })
            .chatText('gain 1 fate from an unclaimed ring');
    }
}


export default TogashiYoshi;

