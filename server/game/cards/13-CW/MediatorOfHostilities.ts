import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { draw } from '../../GameActions/GameActions.js';

class MediatorOfHostilities extends DrawCard {
    static id = 'mediator-of-hostilities';

    setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                onConflictPass: () => true
            })
            .gameAction(draw())
            .limit(AbilityDsl.limit.perRound(2));
    }
}


export default MediatorOfHostilities;
