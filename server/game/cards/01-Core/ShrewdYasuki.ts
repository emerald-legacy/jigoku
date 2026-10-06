import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import { deckSearch, moveCard } from '../../GameActions/GameActions.js';

class ShrewdYasuki extends DrawCard {
    static id = 'shrewd-yasuki';

    setupCardAbilities() {
        this.action('Look at top 2 cards of conflict deck')
            .condition(context => context.player.conflictDeck.length > 0 && context.source.isParticipating() &&
                                  this.game.allCards.some(card => card.type === CardType.Holding && card.location.includes('province') && card.isFaceup()))
            .gameAction(deckSearch({
                amount: 2,
                gameAction: moveCard({
                    destination: Location.Hand
                }),
                shuffle: false,
                reveal: false,
                placeOnBottomInRandomOrder: true
            }))
            .effect('look at the top two cards of their conflict deck');
    }
}


export default ShrewdYasuki;
