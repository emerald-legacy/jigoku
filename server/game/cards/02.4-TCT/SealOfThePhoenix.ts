import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class SealOfThePhoenix extends DrawCard {
    static id = 'seal-of-the-phoenix';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.whileAttached({
            effect: [
                ability.effects.addFaction('phoenix'),
                ability.effects.addTrait('scholar')
            ]
        });
    }
}


export default SealOfThePhoenix;
