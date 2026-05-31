import DrawCard from '../../DrawCard.js';
import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class OpenWindow extends DrawCard {
    static id = 'open-window';

    setupCardAbilities() {
        this.action({
            title: 'Move a Shinobi into the conflict',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('shinobi'),
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }
}


export default OpenWindow;
