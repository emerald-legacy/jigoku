import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { Locations, Players, CardTypes } from '../../Constants.js';

class Sabotage extends DrawCard {
    static id = 'sabotage';

    setupCardAbilities() {
        this.action({
            condition: () => this.game.isDuringConflict('military'),
            title: 'Discard a card in a province',
            target: {
                location: Locations.Provinces,
                controller: Players.Opponent,
                cardType: [CardTypes.Character, CardTypes.Holding, CardTypes.Event],
                gameAction: AbilityDsl.actions.discardCard()
            }
        });
    }
}

export default Sabotage;
