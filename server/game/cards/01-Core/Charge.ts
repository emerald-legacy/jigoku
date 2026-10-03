import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Charge extends DrawCard {
    static id = 'charge';

    setupCardAbilities() {
        this.action('Put a character into play from a province')
            .condition(() => this.game.currentConflict?.conflictType === 'military')
            .target('target', {
                cardType: CardType.Character,
                location: Location.Provinces,
                controller: Players.Self
            }, AbilityDsl.actions.putIntoConflict());
    }
}


export default Charge;
