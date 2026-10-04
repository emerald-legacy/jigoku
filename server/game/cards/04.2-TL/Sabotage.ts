import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType, ConflictType } from '../../Constants.js';

class Sabotage extends DrawCard {
    static id = 'sabotage';

    setupCardAbilities() {
        this.action('Discard a card in a province')
            .condition(() => this.game.isDuringConflict(ConflictType.Military))
            .target('target', {
                location: Location.Provinces,
                controller: Players.Opponent,
                cardType: [CardType.Character, CardType.Holding, CardType.Event]
            }, AbilityDsl.actions.discardCard());
    }
}

export default Sabotage;
