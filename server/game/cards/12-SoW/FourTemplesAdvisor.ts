import DrawCard from '../../DrawCard.js';
import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { draw } from '../../GameActions/GameActions.js';

class FourTemplesAdvisor extends DrawCard {
    static id = 'four-temples-advisor';

    setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                onMoveFate: (event, context) => event.origin && event.origin.type === 'ring' && event.recipient === context.player
            })
            .gameAction(draw())
            .effect('draw a card')
            .limit(unlimitedPerConflict());
    }
}


export default FourTemplesAdvisor;
