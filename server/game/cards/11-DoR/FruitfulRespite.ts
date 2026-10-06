import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { gainFate } from '../../GameActions/GameActions.js';

class FruitfulRespite extends DrawCard {
    static id = 'fruitful-respite';

    setupCardAbilities() {
        this.reaction('Gain fate')
            .when({
                onConflictPass: (event, context) => context.player.opponent && event.conflict.attackingPlayer === context.player.opponent && context.player.opponent.cardsInPlay.some(card => card.type === CardType.Character && !card.bowed)
            })
            .gameAction(gainFate({ amount: 2 }));
    }
}


export default FruitfulRespite;
