import DrawCard from '../../../DrawCard.js';
import { CardType, Location, RemainingCards, Trait } from '../../../Constants.js';
import { moveCard } from '../../../GameActions/GameActions.js';
import { msg } from '../../../GameChat.js';
import { topCards } from '../../topCards.js';

class AshigaruCompany extends DrawCard {
    static id = 'ashigaru-company';

    override setupCardAbilities() {
        this.reaction('Search your conflict deck')
            .when({
                onCardAttached: (event, context) => event.card === context.source && event.originalLocation !== Location.PlayArea
            })
            .deckSearch({
                cardsToLookAt: 5,
                cardCondition: (card) => card.hasTrait(Trait.Follower) && card.type === CardType.Attachment,
                gameAction: moveCard({
                    destination: Location.Hand
                }),
                remainingCards: RemainingCards.BottomRandom
            })
            .chatText((context) => msg`look at the ${topCards(5, context.player.conflictDeck.length, true)} of their deck`);
    }
}


export default AshigaruCompany;
