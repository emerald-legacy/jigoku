import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class SealOfTheScorpion extends DrawCard {
    static id = 'seal-of-the-scorpion';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.whileAttached({
            effect: [
                ability.effects.addFaction('scorpion'),
                ability.effects.addTrait('shinobi')
            ]
        });
    }
}


export default SealOfTheScorpion;
