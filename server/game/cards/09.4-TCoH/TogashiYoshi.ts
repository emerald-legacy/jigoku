import DrawCard from '../../DrawCard.js';
import { selectRing, takeFateFromRing } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class TogashiYoshi extends DrawCard {
    static id = 'togashi-yoshi';

    setupCardAbilities() {
        this.reaction('Gain 1 fate from an unclaimed ring')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.source.controller &&
                    context.source.isParticipating()
            })
            .gameAction(selectRing(context => ({
                ringCondition:  ring => ring.fate >= 1 && ring.isUnclaimed(),
                target: context.ring,
                gameAction: takeFateFromRing()
            })))
            .chatText((context) => msg`gain 1 fate from the ${context.ring}`);
    }
}


export default TogashiYoshi;

