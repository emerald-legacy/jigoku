import DrawCard from '../../DrawCard.js';
import { mustBeDeclaredAsAttacker, mustBeDeclaredAsDefender } from '../../effects.js';

class YoungWarrior extends DrawCard {
    static id = 'young-warrior';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.game.conflictRecord.filter(record => record.completed).length === 0,
            effect: [
                mustBeDeclaredAsAttacker(),
                mustBeDeclaredAsDefender()
            ]
        });
    }
}


export default YoungWarrior;
