import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class PacifistPhilosopher extends DrawCard {
    static id = 'pacifist-philosopher';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Gain 1 fate')
            .when({
                onConflictPass: () => true
            })
            .gameAction(ability.actions.gainFate())
            .limit(ability.limit.perRound(2));
    }
}


export default PacifistPhilosopher;
