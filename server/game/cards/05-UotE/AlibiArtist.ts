import DrawCard from '../../DrawCard.js';
import { Location, RemainingCards, TargetMode } from '../../Constants.js';
import { moveCard } from '../../GameActions/GameActions.js';

class AlibiArtist extends DrawCard {
    static id = 'alibi-artist';

    override setupCardAbilities() {
        this.action('Look at top 2 cards of conflict deck')
            .ifCondition((context) => context.player.honor <= 6)
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


export default AlibiArtist;
