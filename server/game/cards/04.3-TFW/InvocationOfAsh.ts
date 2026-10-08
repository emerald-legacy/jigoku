import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { attach, removeFate, sequential } from '../../GameActions/GameActions.js';
import { Players, CardType } from '../../Constants.js';

class InvocationOfAsh extends DrawCard {
    static id = 'invocation-of-ash';

    setupCardAbilities() {
        this.action('Move to another character')
            .cost(costs.payHonor(1))
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, sequential([
                attach((context) => ({ attachment: context.source })),
                removeFate()
            ]))
            .chatText('move {1} to {0}, then remove a fate from {0}', context => context.source);
    }
}


export default InvocationOfAsh;
