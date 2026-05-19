import DrawCard from '../../drawcard.js';

class WayOfTheDragon extends DrawCard {
    static id = 'way-of-the-dragon';

    setupCardAbilities(ability) {
        this.attachmentConditions({
            limit: 1,
            myControl: true
        });

        this.whileAttached({
            effect: ability.effects.increaseLimitOnAbilities()
        });
    }
}


export default WayOfTheDragon;

