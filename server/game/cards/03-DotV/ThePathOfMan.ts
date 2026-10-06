import DrawCard from '../../DrawCard.js';
import { gainFate } from '../../GameActions/GameActions.js';

class ThePathOfMan extends DrawCard {
    static id = 'the-path-of-man';

    setupCardAbilities() {
        this.reaction('Gain 2 fate')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.player && (event.conflict.skillDifference ?? 0) >= 5
            })
            .gameAction(gainFate({ amount: 2 }));
    }
}


export default ThePathOfMan;
