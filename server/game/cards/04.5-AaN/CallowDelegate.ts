import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class CallowDelegate extends DrawCard {
    static id = 'callow-delegate';

    setupCardAbilities() {
        this.interrupt('Honor a character')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source
            })
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self
            }, AbilityDsl.actions.honor());
    }
}


export default CallowDelegate;
