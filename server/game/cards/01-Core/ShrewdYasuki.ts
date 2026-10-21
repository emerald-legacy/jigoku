import DrawCard from '../../DrawCard.js';
import { Location, CardType, RemainingCards, TargetMode } from '../../Constants.js';
import { moveCard } from '../../GameActions/GameActions.js';

class ShrewdYasuki extends DrawCard {
    static id = 'shrewd-yasuki';

    override setupCardAbilities() {
        this.action('Look at top 2 cards of conflict deck')
            .condition((context) => context.player.conflictDeck.length > 0 && context.source.isParticipating())
            .ifCondition((context) => context.game.allCards.some((card) => card.type === CardType.Holding && card.isInProvince() && card.isFaceup()))
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


export default ShrewdYasuki;
