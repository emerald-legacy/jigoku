import DrawCard from '../../DrawCard.js';
import { perRound } from '../../AbilityLimit.js';

class PacifistPhilosopher extends DrawCard {
    static id = 'pacifist-philosopher';

    setupCardAbilities() {
        this.reaction('Gain 1 fate')
            .when({
                onConflictPass: () => true
            })
            .gainFate()
            .limit(perRound(2));
    }
}


export default PacifistPhilosopher;
