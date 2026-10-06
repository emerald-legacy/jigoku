import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType, ConflictType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Charge extends DrawCard {
    static id = 'charge';

    setupCardAbilities() {
        this.conflictAction('Put a character into play from a province', { conflictType: ConflictType.Military })
            .target({
                cardType: CardType.Character,
                location: Location.Provinces,
                controller: Players.Self
            }, AbilityDsl.actions.putIntoConflict());
    }
}


export default Charge;
