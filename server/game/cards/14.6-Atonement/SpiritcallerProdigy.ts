import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { putIntoPlay } from '../../GameActions/GameActions.js';
import { CardType, Location, Players } from '../../Constants.js';

class SpiritcallerProdigy extends DrawCard {
    static id = 'spiritcaller-prodigy';

    setupCardAbilities() {
        this.action('Resurrect a character')
            .cost(costs.sacrificeSelf())
            .target({
                activePromptTitle: 'Choose a character from your dynasty discard pile',
                location: [Location.DynastyDiscardPile],
                cardType: CardType.Character,
                cardCondition: (card) => card.isFaction('lion') && card.costLessThan(4),
                controller: Players.Self
            }, putIntoPlay())
            .chatText('call {0} back from the dead');
    }
}


export default SpiritcallerProdigy;
