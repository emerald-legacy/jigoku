import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { moveToConflict } from '../../GameActions/GameActions.js';

class OpenWindow extends DrawCard {
    static id = 'open-window';

    setupCardAbilities() {
        this.action('Move a Shinobi into the conflict')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('shinobi')
            }, moveToConflict());
    }
}


export default OpenWindow;
