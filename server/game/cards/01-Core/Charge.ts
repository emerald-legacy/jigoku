import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType, ConflictType } from '../../Constants.js';
import { putIntoConflict } from '../../GameActions/GameActions.js';

class Charge extends DrawCard {
    static id = 'charge';

    override setupCardAbilities() {
        this.action('Put a character into play from a province')
            .condition((context) => context.game.isDuringConflict(ConflictType.Military))
            .target({
                cardType: CardType.Character,
                location: Location.Provinces,
                controller: Players.Self
            }, putIntoConflict());
    }
}


export default Charge;
