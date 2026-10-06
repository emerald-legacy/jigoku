import { discardCard } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType, ConflictType } from '../../Constants.js';

class Sabotage extends DrawCard {
    static id = 'sabotage';

    setupCardAbilities() {
        this.conflictAction('Discard a card in a province', { conflictType: ConflictType.Military })
            .target({
                location: Location.Provinces,
                controller: Players.Opponent,
                cardType: [CardType.Character, CardType.Holding, CardType.Event]
            }, discardCard());
    }
}

export default Sabotage;
