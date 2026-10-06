import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { honor } from '../../GameActions/GameActions.js';

class WayOfTheCrane extends DrawCard {
    static id = 'way-of-the-crane';

    setupCardAbilities() {
        this.action('Honor a character')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.isFaction('crane')
            }, honor());
    }
}


export default WayOfTheCrane;
