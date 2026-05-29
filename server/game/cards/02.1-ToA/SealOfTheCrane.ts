import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class SealOfTheCrane extends DrawCard {
    static id = 'seal-of-the-crane';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.whileAttached({
            effect: [
                ability.effects.addFaction('crane'),
                ability.effects.addTrait('duelist')
            ]
        });
    }
}


export default SealOfTheCrane;
