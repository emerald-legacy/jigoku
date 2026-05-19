import DrawCard from '../../drawcard.js';

class SealOfTheCrane extends DrawCard {
    static id = 'seal-of-the-crane';

    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addFaction('crane'),
                ability.effects.addTrait('duelist')
            ]
        });
    }
}


export default SealOfTheCrane;
