import { msg } from '../../GameChat.js';
import * as costs from '../../costs/index.js';
import { ready } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class IAmReady extends DrawCard {
    static id = 'i-am-ready';

    setupCardAbilities() {
        this.action('Ready a character')
            .cost(costs.removeFate({
                cardType: CardType.Character,
                cardCondition: (card) => card.isFaction('unicorn') && card.bowed
            }))
            .handler((context) => ready().resolve(context.costs.removeFate, context))
            .chatText((context) => msg`ready ${context.costs.removeFate}`)
            .cannotBeMirrored();
    }
}


export default IAmReady;
