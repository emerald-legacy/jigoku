import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { attach } from '../../GameActions/GameActions.js';
import { Players, CardType } from '../../Constants.js';

class InvocationOfAsh extends DrawCard {
    static id = 'invocation-of-ash';

    override setupCardAbilities() {
        this.action('Move to another character')
            .cost(costs.payHonor(1))
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card !== context.source.parentCharacter
            }, attach((context) => ({ attachment: context.source })))
            .chatText((context) => msg`move ${context.source} to ${context.chatTarget()}, then remove a fate from ${context.chatTarget()}`)
            .then()
            .removeFate((context) => ({ target: context.target }));
    }
}


export default InvocationOfAsh;
