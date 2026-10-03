import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class SealOfTheCrab extends DrawCard {
    static id = 'seal-of-the-crab';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                AbilityDsl.effects.addFaction('crab'),
                AbilityDsl.effects.addTrait('berserker')
            ]
        });
    }
}


export default SealOfTheCrab;
