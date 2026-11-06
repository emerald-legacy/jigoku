import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { alternateFatePool } from '../../effects.js';

class StudentOfEsoterica extends DrawCard {
    static id = 'student-of-esoterica';

    override setupCardAbilities() {
        this.persistentEffect({
            effect: alternateFatePool((card, context) => {
                if(card.hasTrait(Trait.Spell) && context.source.isDrawCard()) {
                    return context.source;
                }
                return false;
            })
        });
    }
}


export default StudentOfEsoterica;
