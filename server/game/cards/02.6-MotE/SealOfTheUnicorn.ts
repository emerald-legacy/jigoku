import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class SealOfTheUnicorn extends DrawCard {
    static id = 'seal-of-the-unicorn';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                AbilityDsl.effects.addFaction('unicorn'),
                AbilityDsl.effects.addTrait('cavalry')
            ]
        });
    }
}


export default SealOfTheUnicorn;
