import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import { bow, ready } from '../../GameActions/GameActions.js';

class AgainstTheWaves extends DrawCard {
    static id = 'against-the-waves';

    setupCardAbilities() {
        this.action('Bow or ready a shugenja')
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.hasTrait('shugenja'),
                controller: Players.Self
            }, bow(), ready());
    }
}


export default AgainstTheWaves;
