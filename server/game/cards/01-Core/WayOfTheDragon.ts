import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class WayOfTheDragon extends DrawCard {
    static id = 'way-of-the-dragon';

    setupCardAbilities(ability: typeof AbilityDsl) {
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

