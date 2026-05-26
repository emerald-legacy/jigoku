import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class SealOfTheLion extends DrawCard {
    static id = 'seal-of-the-lion';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.whileAttached({
            effect: [
                ability.effects.addFaction('lion'),
                ability.effects.addTrait('commander')
            ]
        });
    }
}


export default SealOfTheLion;
