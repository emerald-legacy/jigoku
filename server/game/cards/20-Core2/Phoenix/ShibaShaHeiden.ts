import * as costs from '../../../costs/index.js';
import { perRound } from '../../../AbilityLimit.js';
import { draw, gainFate } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ShibaShaHeiden extends DrawCard {
    static id = 'shiba-sha-heiden';

    setupCardAbilities() {
        /**
         * The card is a single action, but implementing the cost was too much work
         * Should be fixed later when choice costs are implemented
         */

        const sharedLimit = perRound(1);
        this.action('Pay 1 fate to draw a card')
            .cost(costs.payFate(1))
            .gameAction(draw())
            .limit(sharedLimit);
        this.action('Discard a card to gain 1 fate')
            .cost(costs.discardCard())
            .gameAction(gainFate())
            .limit(sharedLimit);
        this.action('Discard a card to draw a card')
            .cost(costs.discardCard())
            .gameAction(draw())
            .limit(sharedLimit);
    }
}
