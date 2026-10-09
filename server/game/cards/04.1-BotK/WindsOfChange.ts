import { returnRing } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

class WindsOfChange extends DrawCard {
    static id = 'winds-of-change';

    setupCardAbilities() {
        this.action('Return the air ring to the unclaimed pool')
            .condition(() => this.game.rings.air.isClaimed())
            .gameAction(returnRing((context) => ({
                target: context.game.rings.air
            })))
            .chatText('return the air ring to the unclaimed pool');
    }
}


export default WindsOfChange;
