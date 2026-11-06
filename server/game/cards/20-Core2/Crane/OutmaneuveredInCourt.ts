import { CardType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { bow } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class OutmaneuveredInCourt extends DrawCard {
    static id = 'outmaneuvered-in-court';

    override setupCardAbilities() {
        this.action('Bow a character')
            .cost(costs.discardImperialFavor())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => !card.isParticipating() && !card.isUnique()
            }, bow());
    }
}
