import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class SealOfTheLion extends DrawCard {
    static id = 'seal-of-the-lion';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                AbilityDsl.effects.addFaction('lion'),
                AbilityDsl.effects.addTrait('commander')
            ]
        });
    }
}


export default SealOfTheLion;
