import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class SealOfTheCrab extends DrawCard {
    static id = 'seal-of-the-crab';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.whileAttached({
            effect: [
                ability.effects.addFaction('crab'),
                ability.effects.addTrait('berserker')
            ]
        });
    }
}


export default SealOfTheCrab;
