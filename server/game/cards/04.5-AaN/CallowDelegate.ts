import { honor } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class CallowDelegate extends DrawCard {
    static id = 'callow-delegate';

    setupCardAbilities() {
        this.interrupt('Honor a character')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, honor());
    }
}


export default CallowDelegate;
