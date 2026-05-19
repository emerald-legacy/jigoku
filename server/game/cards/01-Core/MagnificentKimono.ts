import DrawCard from '../../drawcard.js';

class MagnificentKimono extends DrawCard {
    static id = 'magnificent-kimono';

    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword('pride')
        });
    }
}


export default MagnificentKimono;


