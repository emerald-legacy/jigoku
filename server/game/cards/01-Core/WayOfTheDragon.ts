import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class WayOfTheDragon extends DrawCard {
    static id = 'way-of-the-dragon';

    setupCardAbilities() {
        this.attachmentConditions({
            limit: 1,
            myControl: true
        });

        this.whileAttached({
            effect: AbilityDsl.effects.increaseLimitOnAbilities()
        });
    }
}


export default WayOfTheDragon;

