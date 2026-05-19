import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class StudentOfEsoterica extends DrawCard {
    static id = 'student-of-esoterica';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.alternateFatePool(card => {
                if(card.hasTrait('spell')) {
                    return this;
                }
                return false;
            })
        });
    }
}


export default StudentOfEsoterica;
