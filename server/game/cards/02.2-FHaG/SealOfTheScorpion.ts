import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class SealOfTheScorpion extends DrawCard {
    static id = 'seal-of-the-scorpion';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                AbilityDsl.effects.addFaction('scorpion'),
                AbilityDsl.effects.addTrait('shinobi')
            ]
        });
    }
}


export default SealOfTheScorpion;
