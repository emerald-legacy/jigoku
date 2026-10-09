import DrawCard from '../../../DrawCard.js';
import { moveCard } from '../../../GameActions/GameActions.js';
import { ConflictType, Location, RemainingCards } from '../../../Constants.js';

class EloquentAdvocate extends DrawCard {
    static id = 'eloquent-advocate';

    setupCardAbilities() {
        this.reaction('Look at top 2 cards of conflict deck')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isParticipating() &&
                                                   event.conflict.conflictType === ConflictType.Political
            })
            .deckSearch({
                cardsToLookAt: 2,
                gameAction: moveCard({
                    destination: Location.Hand
                }),
                remainingCards: RemainingCards.BottomRandom,
                reveal: false
            })
            .chatText('look at the top two cards of their conflict deck');
    }
}

export default EloquentAdvocate;

