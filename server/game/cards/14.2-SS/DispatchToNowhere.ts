import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';

class DispatchToNowhere extends DrawCard {
    static id = 'dispatch-to-nowhere';

    setupCardAbilities() {
        this.action('Discard a character with no fate')
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.getFate() === 0
            }, discardFromPlay());
    }
}


export default DispatchToNowhere;
