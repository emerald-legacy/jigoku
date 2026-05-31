import DrawCard from '../../DrawCard.js';
import { Locations, Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Charge extends DrawCard {
    static id = 'charge';

    setupCardAbilities() {
        this.action({
            title: 'Put a character into play from a province',
            condition: () => this.game.currentConflict?.conflictType === 'military',
            target: {
                cardType: CardTypes.Character,
                location: Locations.Provinces,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.putIntoConflict()
            }
        });
    }
}


export default Charge;
