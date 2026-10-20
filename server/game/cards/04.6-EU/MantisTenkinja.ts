import * as costs from '../../costs/index.js';
import { reduceNextPlayedCardCost } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class MantisTenkinja extends DrawCard {
    static id = 'mantis-tenkinja';

    override setupCardAbilities() {
        this.interrupt('Reduce cost of next event')
            .when({
                onCardPlayed: (event, context) =>
                    event.card.type === CardType.Event && event.player === context.player
            })
            .cost(costs.payHonor(1))
            .playerLastingEffect((context) => ({
                effect: reduceNextPlayedCardCost(1, (card) => card === context.event.card)
            }))
            .chatText('reduce the cost of their next event by 1');
    }
}


export default MantisTenkinja;
