import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { alternateFatePool } from '../../effects.js';

class StudentOfEsoterica extends DrawCard {
    static id = 'student-of-esoterica';

    override setupCardAbilities() {
        this.persistentEffect({
            effect: alternateFatePool((card) => {
                if(card.hasTrait(Trait.Spell)) {
                    return this;
                }
                return false;
            })
        });
    }
}


export default StudentOfEsoterica;
