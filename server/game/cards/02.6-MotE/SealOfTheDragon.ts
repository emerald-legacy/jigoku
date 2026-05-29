import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class SealOfTheDragon extends DrawCard {
    static id = 'seal-of-the-dragon';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.whileAttached({
            effect: [
                ability.effects.addFaction('dragon'),
                ability.effects.addTrait('monk')
            ]
        });
    }
}


export default SealOfTheDragon;
