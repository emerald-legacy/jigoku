import DrawCard from '../../../DrawCard.js';
import { CardType, Location } from '../../../Constants.js';
import { deckSearch, moveCard } from '../../../GameActions/GameActions.js';

class AshigaruCompany extends DrawCard {
    static id = 'ashigaru-company';

    setupCardAbilities() {
        this.reaction('Search your conflict deck')
            .when({
                onCardAttached: (event, context) => event.card === context.source && event.originalLocation !== Location.PlayArea
            })
            .gameAction(deckSearch({
                amount: 5,
                cardCondition: (card) => card.hasTrait('follower') && card.type === CardType.Attachment,
                gameAction: moveCard({
                    destination: Location.Hand
                }),
                shuffle: false,
                placeOnBottomInRandomOrder: true
            }))
            .effect('look at the top five cards of their deck');
    }
}


export default AshigaruCompany;
