import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType } from '../../Constants.js';

class Sabotage extends DrawCard {
    static id = 'sabotage';

    setupCardAbilities() {
        this.action({
            condition: () => this.game.isDuringConflict('military'),
            title: 'Discard a card in a province',
            target: {
                location: Location.Provinces,
                controller: Players.Opponent,
                cardType: [CardType.Character, CardType.Holding, CardType.Event],
                gameAction: AbilityDsl.actions.discardCard()
            }
        });
    }
}

export default Sabotage;
