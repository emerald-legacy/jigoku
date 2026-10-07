import DrawCard from '../../DrawCard.js';
import { perRound } from '../../AbilityLimit.js';
import { draw } from '../../GameActions/GameActions.js';

class MediatorOfHostilities extends DrawCard {
    static id = 'mediator-of-hostilities';

    setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                onConflictPass: () => true
            })
            .gameAction(draw())
            .limit(perRound(2));
    }
}


export default MediatorOfHostilities;
