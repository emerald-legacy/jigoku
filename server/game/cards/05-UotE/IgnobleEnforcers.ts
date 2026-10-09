import { msg } from '../../GameChat.js';
import * as costs from '../../costs/index.js';
import DrawCard from '../../DrawCard.js';

class IgnobleEnforcers extends DrawCard {
    static id = 'ignoble-enforcers';

    setupCardAbilities() {
        this.reaction('Place additional fate on this character')
            .when({
                onCardPlayed: (event, context) => event.card === context.source
            })
            .cost(costs.payVariableHonor(() => 3))
            .placeFate((context) => ({ amount: context.costs.honorPaid }))
            .chatText((context) => msg`place ${context.costs.honorPaid} fate on ${context.chatTarget()}`);
    }
}


export default IgnobleEnforcers;
