import DrawCard from '../../DrawCard.js';
import { perRound } from '../../AbilityLimit.js';
import { gainFate } from '../../GameActions/GameActions.js';

class PacifistPhilosopher extends DrawCard {
    static id = 'pacifist-philosopher';

    setupCardAbilities() {
        this.reaction('Gain 1 fate')
            .when({
                onConflictPass: () => true
            })
            .gameAction(gainFate())
            .limit(perRound(2));
    }
}


export default PacifistPhilosopher;
