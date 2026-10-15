import DrawCard from '../../DrawCard.js';
import { alternateFatePool } from '../../effects.js';

class StudentOfEsoterica extends DrawCard {
    static id = 'student-of-esoterica';

    setupCardAbilities() {
        this.persistentEffect({
            effect: alternateFatePool((card) => {
                if(card.hasTrait('spell')) {
                    return this;
                }
                return false;
            })
        });
    }
}


export default StudentOfEsoterica;
