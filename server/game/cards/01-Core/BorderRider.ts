import DrawCard from '../../DrawCard.js';
import { ready } from '../../GameActions/GameActions.js';

class BorderRider extends DrawCard {
    static id = 'border-rider';

    setupCardAbilities() {
        this.action('Ready this character')
            .gameAction(ready());
    }
}


export default BorderRider;


