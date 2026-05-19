import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players } from '../../Constants.js';

class ShosuroDenmaru extends DrawCard {
    static id = 'shosuro-denmaru';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            match: (card) => card.isHonored,
            effect: AbilityDsl.effects.setBaseGlory(0)
        });
    }
}


export default ShosuroDenmaru;
