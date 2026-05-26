import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class SealOfTheUnicorn extends DrawCard {
    static id = 'seal-of-the-unicorn';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.whileAttached({
            effect: [
                ability.effects.addFaction('unicorn'),
                ability.effects.addTrait('cavalry')
            ]
        });
    }
}


export default SealOfTheUnicorn;
