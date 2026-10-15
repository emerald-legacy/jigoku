import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { returnToDeck } from '../../GameActions/GameActions.js';

class HidaTomonatsu extends DrawCard {
    static id = 'hida-tomonatsu';

    setupCardAbilities() {
        this.reaction('Return a character to deck')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isDefending()
            })
            .cost(costs.sacrificeSelf())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isAttacking() && !card.isUnique()
            }, returnToDeck());
    }
}


export default HidaTomonatsu;
