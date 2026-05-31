import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class ShintaoMonastery extends DrawCard {
    static id = 'shintao-monastery';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.additionalCardPlayed(1)
        });
    }
}


export default ShintaoMonastery;
