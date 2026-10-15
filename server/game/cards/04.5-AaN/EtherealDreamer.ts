import { msg } from '../../GameChat.js';
import { modifyBothSkills } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { Duration, Phase } from '../../Constants.js';

class EtherealDreamer extends DrawCard {
    static id = 'ethereal-dreamer';

    setupCardAbilities() {
        this.reaction('Gain +2/+2 while contesting the target ring')
            .when({
                onPhaseStarted: (event) => event.phase === Phase.Conflict
            })
            .ringTarget({
                ringCondition: () => true
            })
            .cardLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                condition: () => context.ring.isContested(),
                effect: modifyBothSkills(2)
            }))
            .chatText((context) => msg`give herself +2${'military'}/+2${'political'} while the ${context.chatTarget()} is contested`);
    }
}


export default EtherealDreamer;
