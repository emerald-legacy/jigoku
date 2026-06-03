import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FruitfulRespite extends DrawCard {
    static id = 'fruitful-respite';

    setupCardAbilities() {
        this.reaction({
            title: 'Gain fate',
            when: {
                onConflictPass: (event, context) => context.player.opponent && event.conflict.attackingPlayer === context.player.opponent && context.player.opponent.cardsInPlay.some(card => card.type === CardType.Character && !card.bowed)
            },
            gameAction: AbilityDsl.actions.gainFate({ amount: 2 })
        });
    }
}


export default FruitfulRespite;
