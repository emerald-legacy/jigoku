import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';


class LionsPrideParagon extends DrawCard {
    static id = 'lion-s-pride-paragon';

    setupCardAbilities() {
        this.dire({
            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}


export default LionsPrideParagon;
