import DrawCard from '../../DrawCard.js';
import { CardType, Location } from '../../Constants.js';
import { sacrifice } from '../../GameActions/GameActions.js';

class IronMine extends DrawCard {
    static id = 'iron-mine';

    setupCardAbilities() {
        this.wouldInterrupt('Prevent a character from leaving play')
            .when({
                onCardLeavesPlay: (event, context) => event.card.controller === context.player && event.card.type === CardType.Character && event.card.location === Location.PlayArea
            })
            .cancel({
                replacementGameAction: sacrifice((context) => ({ target: context.source }))
            })
            .chatText('prevent {1} from leaving play', (context) => context.event.card);
    }
}


export default IronMine;
