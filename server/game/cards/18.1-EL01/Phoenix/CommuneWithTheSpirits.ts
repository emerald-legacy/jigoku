import DrawCard from '../../../drawcard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { TargetModes } from '../../../Constants.js';

class CommuneWithTheSpirits extends DrawCard {
    static id = 'commune-with-the-spirits';

    setupCardAbilities() {
        this.action({
            title: 'Claim a ring',
            target: {
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose an unclaimed ring',
                ringCondition: ring => ring.isUnclaimed(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.takeFateFromRing(context => ({
                        target: context.ring,
                        amount: context.ring.fate,
                        removeOnly: true
                    })),
                    AbilityDsl.actions.claimRing({ takeFate: false, type: 'political'})
                ])
            },
            max: AbilityDsl.limit.perRound(1),
            effect: 'discard all fate from the {0} and claim it as a political ring'
        });
    }
}

export default CommuneWithTheSpirits;
