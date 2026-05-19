import DrawCard from '../../drawcard.js';
import { Durations, TargetModes, Phases } from '../../Constants.js';

class EtherealDreamer extends DrawCard {
    static id = 'ethereal-dreamer';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain +2/+2 while contesting the target ring',
            when: {
                onPhaseStarted: event => event.phase === Phases.Conflict
            },
            target: {
                mode: TargetModes.Ring,
                ringCondition: () => true
            },
            effect: 'give herself +2{1}/+2{2} while the {0} is contested',
            effectArgs: ['military', 'political'],
            gameAction: ability.actions.cardLastingEffect(context => ({
                duration: Durations.UntilEndOfPhase,
                condition: () => context.ring.isContested(),
                effect: ability.effects.modifyBothSkills(2)
            }))
        });
    }
}


export default EtherealDreamer;
