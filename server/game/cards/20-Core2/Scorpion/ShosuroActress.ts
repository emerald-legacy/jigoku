import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ShosuroActress extends DrawCard {
    static id = 'shosuro-actress';

    setupCardAbilities() {
        this.action({
            title: 'Put an opponent\'s character into play',
            cost: AbilityDsl.costs.sacrificeSelf(),
            target: {
                cardType: CardType.Character,
                location: [Location.ConflictDiscardPile, Location.DynastyDiscardPile],
                controller: Players.Opponent,
                cardCondition: (card) => card.costLessThan(4) && !card.hasTrait('shinobi'),
                gameAction: AbilityDsl.actions.putIntoConflict()
            }
        });
    }
}
