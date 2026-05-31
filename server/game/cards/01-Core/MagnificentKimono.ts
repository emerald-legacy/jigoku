import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class MagnificentKimono extends DrawCard {
    static id = 'magnificent-kimono';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.whileAttached({
            effect: ability.effects.addKeyword('pride')
        });
    }
}


export default MagnificentKimono;


