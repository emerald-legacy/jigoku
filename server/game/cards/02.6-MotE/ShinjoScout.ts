import DrawCard from '../../DrawCard.js';
import { gainFate } from '../../GameActions/GameActions.js';

class ShinjoScout extends DrawCard {
    static id = 'shinjo-scout';

    setupCardAbilities() {
        this.reaction('Gain 1 fate')
            .when({
                onPassDuringDynasty: (event, context) => event.player === context.player && event.firstToPass
            })
            .gameAction(gainFate());
    }
}


export default ShinjoScout;
