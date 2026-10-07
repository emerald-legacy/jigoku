import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class FruitfulRespite extends DrawCard {
    static id = 'fruitful-respite';

    setupCardAbilities() {
        this.reaction('Gain fate')
            .when({
                onConflictPass: (event, context) => context.player.opponent && event.conflict.attackingPlayer === context.player.opponent && context.player.opponent.cardsInPlay.some(card => card.type === CardType.Character && !card.bowed)
            })
            .gainFate(2);
    }
}


export default FruitfulRespite;
