import DrawCard from '../../drawcard.js';
import { Locations, Players } from '../../Constants.js';

class AncestralArmory extends DrawCard {
    static id = 'ancestral-armory';

    setupCardAbilities(ability) {
        this.action({
            title: 'Return a weapon attachment in your conflict discard pile to your hand',
            cost: ability.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Choose a weapon attachment from your conflict discard pile',
                cardCondition: card => card.hasTrait('weapon'),
                location: [Locations.ConflictDiscardPile],
                controller: Players.Self,
                gameAction: ability.actions.moveCard({ destination: Locations.Hand })
            }
        });
    }
}


export default AncestralArmory;
