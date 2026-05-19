import DrawCard from '../../drawcard.js';

class SealOfThePhoenix extends DrawCard {
    static id = 'seal-of-the-phoenix';

    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addFaction('phoenix'),
                ability.effects.addTrait('scholar')
            ]
        });
    }
}


export default SealOfThePhoenix;
