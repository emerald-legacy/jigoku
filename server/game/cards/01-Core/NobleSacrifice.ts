import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';

class NobleSacrifice extends DrawCard {
    static id = 'noble-sacrifice';

    setupCardAbilities() {
        this.action('Sacrifice honored character to discard dishonored one')
            .cost(costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: card => card.isHonored
            }))
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.isDishonored
            }, discardFromPlay());
    }
}


export default NobleSacrifice;
