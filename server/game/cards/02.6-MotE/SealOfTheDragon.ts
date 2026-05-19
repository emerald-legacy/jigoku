import DrawCard from '../../drawcard.js';

class SealOfTheDragon extends DrawCard {
    static id = 'seal-of-the-dragon';

    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addFaction('dragon'),
                ability.effects.addTrait('monk')
            ]
        });
    }
}


export default SealOfTheDragon;
