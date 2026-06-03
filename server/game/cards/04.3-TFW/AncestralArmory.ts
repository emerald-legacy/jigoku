import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Location, Players } from '../../Constants.js';

class AncestralArmory extends DrawCard {
    static id = 'ancestral-armory';

    setupCardAbilities() {
        this.action({
            title: 'Return a weapon attachment in your conflict discard pile to your hand',
            cost: AbilityDsl.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Choose a weapon attachment from your conflict discard pile',
                cardCondition: card => card.hasTrait('weapon'),
                location: [Location.ConflictDiscardPile],
                controller: Players.Self,
                gameAction: AbilityDsl.actions.moveCard({ destination: Location.Hand })
            }
        });
    }
}


export default AncestralArmory;
