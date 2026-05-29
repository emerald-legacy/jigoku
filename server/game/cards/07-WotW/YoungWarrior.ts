import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class YoungWarrior extends DrawCard {
    static id = 'young-warrior';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.game.conflictRecord.filter(record => record.completed).length === 0,
            effect: [
                AbilityDsl.effects.mustBeDeclaredAsAttacker(),
                AbilityDsl.effects.mustBeDeclaredAsDefender()
            ]
        });
    }
}


export default YoungWarrior;
