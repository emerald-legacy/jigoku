import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class SealOfTheDragon extends DrawCard {
    static id = 'seal-of-the-dragon';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                AbilityDsl.effects.addFaction('dragon'),
                AbilityDsl.effects.addTrait('monk')
            ]
        });
    }
}


export default SealOfTheDragon;
