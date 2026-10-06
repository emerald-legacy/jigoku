import DrawCard from '../../DrawCard.js';
import { sendHome } from '../../GameActions/GameActions.js';

class DojiRepresentative extends DrawCard {
    static id = 'doji-representative';

    setupCardAbilities() {
        this.action('Move this character home')
            .gameAction(sendHome());
    }
}


export default DojiRepresentative;
