import * as costs from '../../costs/index.js';
import { moveCard } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Location, Players, Trait } from '../../Constants.js';

class AncestralArmory extends DrawCard {
    static id = 'ancestral-armory';

    override setupCardAbilities() {
        this.action('Return a weapon attachment in your conflict discard pile to your hand')
            .cost(costs.sacrificeSelf())
            .target({
                activePromptTitle: 'Choose a weapon attachment from your conflict discard pile',
                cardCondition: (card) => card.hasTrait(Trait.Weapon),
                location: [Location.ConflictDiscardPile],
                controller: Players.Self
            }, moveCard({ destination: Location.Hand }));
    }
}


export default AncestralArmory;
