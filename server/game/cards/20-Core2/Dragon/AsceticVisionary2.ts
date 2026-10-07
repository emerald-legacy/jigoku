import { CardType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { ready } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class AsceticVisionary2 extends DrawCard {
    static id = 'ascetic-visionary-2';

    setupCardAbilities() {
        this.conflictAction('Ready a character', { evenFromHome: true })
            .cost(costs.payFateToRing(1))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait('monk')
            }, ready());
    }
}
