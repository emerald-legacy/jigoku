import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players } from '../../Constants.js';

class ShosuroDenmaru extends DrawCard {
    static id = 'shosuro-denmaru';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            match: (card: DrawCard) => card.isHonored,
            effect: AbilityDsl.effects.setBaseGlory(0)
        });
    }
}


export default ShosuroDenmaru;
