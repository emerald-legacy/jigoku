import DrawCard from '../../DrawCard.js';
import { setBaseGlory } from '../../effects.js';
import { Players } from '../../Constants.js';

class ShosuroDenmaru extends DrawCard {
    static id = 'shosuro-denmaru';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            match: (card) => card.isHonored,
            effect: setBaseGlory(0)
        });
    }
}


export default ShosuroDenmaru;
