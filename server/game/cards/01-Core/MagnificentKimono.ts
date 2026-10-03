import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class MagnificentKimono extends DrawCard {
    static id = 'magnificent-kimono';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.addKeyword('pride')
        });
    }
}


export default MagnificentKimono;


