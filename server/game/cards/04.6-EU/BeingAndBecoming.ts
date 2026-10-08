import * as costs from '../../costs/index.js';
import { placeFate } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { msg } from '../../GameChat.js';

class BeingAndBecoming extends DrawCard {
    static id = 'being-and-becoming';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.action('Move each fate from an unclaimed ring to attached character')
            .cost(costs.bowParent())
            .ringTarget({
                activePromptTitle: 'Choose an unclaimed ring to move fate from',
                ringCondition: (ring) => ring.isUnclaimed() && ring.fate > 0
            }, placeFate((context) => ({
                origin: context.ring,
                amount: context.ring.fate,
                target: context.source.parentCharacter ?? []
            })))
            .chatText((context) => msg`move ${context.ring.fate} fate from ${context.ring} to ${context.source.parentCharacter}`);
    }
}


export default BeingAndBecoming;
