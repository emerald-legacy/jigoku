import * as costs from '../../../costs/index.js';
import DrawCard from '../../../DrawCard.js';

export default class MerchantOfDesires extends DrawCard {
    static id = 'merchant-of-desires';

    setupCardAbilities() {
        this.action('Draw a card')
            .cost(costs.payHonor(1))
            .cost(costs.optionalOpponentLoseHonor('Lose 1 honor to draw a card?'))
            .draw((context) => ({
                target: context.costs.optionalOpponentLoseHonorPaid && context.player.opponent
                    ? [context.player, context.player.opponent]
                    : context.player
            }))
            .chatText('draw a card. {1} {2}', (context) => [
                context.player.opponent,
                context.costs.optionalOpponentLoseHonorPaid
                    ? 'does not resist and loses 1 honor to also draw a card'
                    : 'resists the temptation'
            ]);
    }
}
