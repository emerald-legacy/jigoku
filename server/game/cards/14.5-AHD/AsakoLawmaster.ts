import DrawCard from '../../DrawCard.js';
import { gainHonor } from '../../GameActions/GameActions.js';

class AsakoLawmaster extends DrawCard {
    static id = 'asako-lawmaster';

    setupCardAbilities() {
        this.reaction('Gain an honor')
            .when({
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player
            })
            .gameAction(gainHonor());
    }
}


export default AsakoLawmaster;
