import * as costs from '../../../costs/index.js';
import { draw, gainFate } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ShibaShaHeiden extends DrawCard {
    static id = 'shiba-sha-heiden';

    override setupCardAbilities() {
        this.action('Gain 1 fate or draw a card')
            .cost(costs.chooseOne({
                'Spend 1 fate': costs.payFate(1),
                'Discard a card': costs.discardCard()
            }))
            .select({
                'Gain 1 fate': gainFate(),
                'Draw a card': draw()
            });
    }
}
