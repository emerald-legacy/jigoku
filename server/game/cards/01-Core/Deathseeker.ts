import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { injure } from '../../GameActions/GameActions.js';

class Deathseeker extends DrawCard {
    static id = 'deathseeker';

    setupCardAbilities() {
        this.reaction('Remove fate/discard character')
            .when({
                afterConflict: (event, context) => event.conflict.loser === context.player && context.source.isAttacking()
            })
            .cost(costs.sacrificeSelf())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent
            }, injure())
            .chatText((context) => msg`${context.target.getFate() > 0 ? 'remove 1 fate from' : 'discard'} ${context.chatTarget()}`);
    }
}


export default Deathseeker;
