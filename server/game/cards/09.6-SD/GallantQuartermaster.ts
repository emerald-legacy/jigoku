import DrawCard from '../../DrawCard.js';
import { gainFate } from '../../GameActions/GameActions.js';

class GallantQuartermaster extends DrawCard {
    static id = 'gallant-quartermaster';

    setupCardAbilities() {
        this.interrupt('Gain two fate')
            .when({
                onCardLeavesPlay: (event, context) => event.isSacrifice && event.card === context.source
            })
            .gameAction(gainFate({ amount: 2 }));
    }
}


export default GallantQuartermaster;
