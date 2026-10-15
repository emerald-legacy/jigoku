import { msg } from '../../../GameChat.js';
import DrawCard from '../../../DrawCard.js';
import { CardType, Location } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { removeFromGame } from '../../../GameActions/GameActions.js';

class RestorativeHotSpring extends DrawCard {
    static id = 'restorative-hot-spring';

    setupCardAbilities() {
        this.wouldInterrupt('Prevent a character from leaving play')
            .when({
                onCardLeavesPlay: (event, context) => event.card.controller === context.player && event.card.type === CardType.Character && event.card.location === Location.PlayArea
            })
            .cost(costs.payFate(1))
            .cancel({
                replacementGameAction: removeFromGame((context) => ({ target: context.source }))
            })
            .chatText((context) => msg`prevent ${context.event.card} from leaving play, removing itself from the game instead`);
    }
}


export default RestorativeHotSpring;
