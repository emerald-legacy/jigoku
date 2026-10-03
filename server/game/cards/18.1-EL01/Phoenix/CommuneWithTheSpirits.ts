import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { ConflictType } from '../../../Constants.js';

class CommuneWithTheSpirits extends DrawCard {
    static id = 'commune-with-the-spirits';

    setupCardAbilities() {
        this.action('Claim a ring')
            .ringTarget('target', {
                activePromptTitle: 'Choose an unclaimed ring',
                ringCondition: ring => ring.isUnclaimed()
            }, AbilityDsl.actions.sequential([
                AbilityDsl.actions.takeFateFromRing(context => ({
                    target: context.ring,
                    amount: context.ring?.fate,
                    removeOnly: true
                })),
                AbilityDsl.actions.claimRing({ takeFate: false, type: ConflictType.Political})
            ]))
            .effect('discard all fate from the {0} and claim it as a political ring')
            .max(AbilityDsl.limit.perRound(1));
    }
}

export default CommuneWithTheSpirits;
