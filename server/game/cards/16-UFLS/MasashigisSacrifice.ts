import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { doesNotBow } from '../../effects.js';
import { CardType } from '../../Constants.js';

class MasashigisSacrifice extends DrawCard {
    static id = 'masashigi-s-sacrifice';

    setupCardAbilities() {
        this.action('Defending characters do not bow as a result of conflict resolution')
            .cost(costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasStatusTokens
            }))
            .condition(() => this.game.isDuringConflict())
            .cardLastingEffect((context) => ({
                target: context.game.currentConflict?.getDefenders(),
                effect: doesNotBow()
            }))
            .chatText('prevent defending characters from bowing at the end of the conflict');
    }
}


export default MasashigisSacrifice;
