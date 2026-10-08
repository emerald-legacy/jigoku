import { modifyBothSkills } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { Duration, Phase } from '../../Constants.js';

class EtherealDreamer extends DrawCard {
    static id = 'ethereal-dreamer';

    setupCardAbilities() {
        this.reaction('Gain +2/+2 while contesting the target ring')
            .when({
                onPhaseStarted: event => event.phase === Phase.Conflict
            })
            .ringTarget({
                ringCondition: () => true
            })
            .cardLastingEffect(context => ({
                duration: Duration.UntilEndOfPhase,
                condition: () => context.ring.isContested(),
                effect: modifyBothSkills(2)
            }))
            .chatText('give herself +2{1}/+2{2} while the {0} is contested', () => (['military', 'political']));
    }
}


export default EtherealDreamer;
