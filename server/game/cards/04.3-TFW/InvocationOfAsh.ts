import { msg } from '../../GameChat.js';
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
            .chatText((context) => msg`move ${context.source} to ${context.chatTarget()}, then remove a fate from ${context.chatTarget()}`);
    }
}


export default InvocationOfAsh;
