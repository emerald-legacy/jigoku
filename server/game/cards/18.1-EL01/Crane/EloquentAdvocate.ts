import DrawCard from '../../../DrawCard.js';
import { moveCard } from '../../../GameActions/GameActions.js';
import { ConflictType, Location, RemainingCards, TargetMode } from '../../../Constants.js';

class EloquentAdvocate extends DrawCard {
    static id = 'eloquent-advocate';

    override setupCardAbilities() {
        this.reaction('Look at top 2 cards of conflict deck')
            .when({
                afterConflict: (event, context) => event.conflict.isOnWinningSide(context.source) &&
                                                   event.conflict.conflictType === ConflictType.Political
            })
            .deckSearch({
                cardsToLookAt: 2,
                mode: TargetMode.Exactly,
                numCards: 1,
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

