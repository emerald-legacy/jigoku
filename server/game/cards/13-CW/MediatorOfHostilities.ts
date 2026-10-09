import DrawCard from '../../DrawCard.js';
import { perRound } from '../../AbilityLimit.js';

class MediatorOfHostilities extends DrawCard {
    static id = 'mediator-of-hostilities';

    setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                onConflictPass: () => true
            })
            .draw()
            .limit(perRound(2));
    }
}


export default MediatorOfHostilities;
