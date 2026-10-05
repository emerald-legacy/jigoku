import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class PacifistPhilosopher extends DrawCard {
    static id = 'pacifist-philosopher';

    setupCardAbilities() {
        this.reaction('Gain 1 fate')
            .when({
                onConflictPass: () => true
            })
            .gameAction(AbilityDsl.actions.gainFate())
            .limit(AbilityDsl.limit.perRound(2));
    }
}


export default PacifistPhilosopher;
