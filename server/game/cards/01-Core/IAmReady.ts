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
                cardCondition: card => card.isFaction('unicorn') && card.bowed
            }))
            .handler((context) => ready().resolve(context.costs.removeFate, context))
            .effect('ready {1}', (context) => context.costs.removeFate)
            .cannotBeMirrored();
    }
}


export default IAmReady;
