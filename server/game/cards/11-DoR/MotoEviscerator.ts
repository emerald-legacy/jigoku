import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { moveToConflict } from '../../GameActions/GameActions.js';

class MotoEviscerator extends DrawCard {
    static id = 'moto-eviscerator';

    setupCardAbilities() {
        this.action('Move this character to conflict')
            .cost(AbilityDsl.costs.payHonor(1))
            .gameAction(moveToConflict());
    }
}


export default MotoEviscerator;
