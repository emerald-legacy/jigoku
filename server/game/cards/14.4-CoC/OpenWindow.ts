import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class OpenWindow extends DrawCard {
    static id = 'open-window';

    setupCardAbilities() {
        this.action('Move a Shinobi into the conflict')
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('shinobi')
            }, AbilityDsl.actions.moveToConflict());
    }
}


export default OpenWindow;
