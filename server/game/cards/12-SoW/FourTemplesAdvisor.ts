import DrawCard from '../../DrawCard.js';
import { unlimited } from '../../AbilityLimit.js';

class FourTemplesAdvisor extends DrawCard {
    static id = 'four-temples-advisor';

    setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                onMoveFate: (event, context) => event.origin && event.origin.type === 'ring' && event.recipient === context.player
            })
            .draw()
            .chatText('draw a card')
            .limit(unlimited());
    }
}


export default FourTemplesAdvisor;
