import DrawCard from '../../DrawCard.js';
import { moveToConflict } from '../../GameActions/GameActions.js';

class ShinjoOutrider extends DrawCard {
    static id = 'shinjo-outrider';

    setupCardAbilities() {
        this.action('Move this character to conflict')
            .gameAction(moveToConflict());
    }
}


export default ShinjoOutrider;
