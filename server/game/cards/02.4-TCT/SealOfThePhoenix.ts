import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class SealOfThePhoenix extends DrawCard {
    static id = 'seal-of-the-phoenix';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                AbilityDsl.effects.addFaction('phoenix'),
                AbilityDsl.effects.addTrait('scholar')
            ]
        });
    }
}


export default SealOfThePhoenix;
