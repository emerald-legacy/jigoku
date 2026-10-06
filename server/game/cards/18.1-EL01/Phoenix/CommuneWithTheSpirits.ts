import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { claimRing, sequential, takeFateFromRing } from '../../../GameActions/GameActions.js';
import { ConflictType } from '../../../Constants.js';

class CommuneWithTheSpirits extends DrawCard {
    static id = 'commune-with-the-spirits';

    setupCardAbilities() {
        this.action('Claim a ring')
            .ringTarget({
                activePromptTitle: 'Choose an unclaimed ring',
                ringCondition: ring => ring.isUnclaimed()
            }, sequential([
                takeFateFromRing(context => ({
                    target: context.ring,
                    amount: context.ring?.fate,
                    removeOnly: true
                })),
                claimRing({ takeFate: false, type: ConflictType.Political})
            ]))
            .effect('discard all fate from the {0} and claim it as a political ring')
            .max(AbilityDsl.limit.perRound(1));
    }
}

export default CommuneWithTheSpirits;
