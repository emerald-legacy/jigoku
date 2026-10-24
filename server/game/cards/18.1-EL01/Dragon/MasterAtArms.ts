import { moveCard } from '../../../GameActions/GameActions.js';
import { Location, Players, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class MasterAtArms extends DrawCard {
    static id = 'master-at-arms';

    override setupCardAbilities() {
        this.reaction('Return a weapon attachment in your conflict discard pile to your hand')
            .when({
                onCardPlayed: (event, context) => event.card === context.source
            })
            .target({
                activePromptTitle: 'Choose a weapon attachment from your conflict discard pile',
                cardCondition: (card) => card.hasTrait(Trait.Weapon),
                location: [Location.ConflictDiscardPile],
                controller: Players.Self
            }, moveCard({ destination: Location.Hand }));
    }
}
