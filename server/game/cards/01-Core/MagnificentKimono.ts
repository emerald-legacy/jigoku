import DrawCard from '../../DrawCard.js';
import { addKeyword } from '../../effects.js';

class MagnificentKimono extends DrawCard {
    static id = 'magnificent-kimono';

    setupCardAbilities() {
        this.whileAttached({
            effect: addKeyword('pride')
        });
    }
}


export default MagnificentKimono;


