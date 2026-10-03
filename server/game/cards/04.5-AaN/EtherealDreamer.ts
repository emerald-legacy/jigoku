import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Duration, Phases } from '../../Constants.js';

class EtherealDreamer extends DrawCard {
    static id = 'ethereal-dreamer';

    setupCardAbilities() {
        this.reaction('Gain +2/+2 while contesting the target ring')
            .when({
                onPhaseStarted: event => event.phase === Phases.Conflict
            })
            .ringTarget('target', {
                ringCondition: () => true
            })
            .gameAction(AbilityDsl.actions.cardLastingEffect(context => ({
                duration: Duration.UntilEndOfPhase,
                condition: () => !!context.ring?.isContested(),
                effect: AbilityDsl.effects.modifyBothSkills(2)
            })))
            .effect('give herself +2{1}/+2{2} while the {0} is contested', () => (['military', 'political']));
    }
}


export default EtherealDreamer;
