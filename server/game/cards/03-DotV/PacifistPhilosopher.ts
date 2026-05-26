import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class PacifistPhilosopher extends DrawCard {
    static id = 'pacifist-philosopher';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Gain 1 fate',
            limit: ability.limit.perRound(2),
            when: {
                onConflictPass: () => true
            },
            gameAction: ability.actions.gainFate()
        });
    }
}


export default PacifistPhilosopher;
