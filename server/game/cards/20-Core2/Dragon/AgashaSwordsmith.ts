import { CardType, Location } from '../../../Constants.js';
import { perRound } from '../../../AbilityLimit.js';
import { moveCard } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class AgashaSwordsmith extends DrawCard {
    static id = 'agasha-swordsmith';

    setupCardAbilities() {
        this.action('Search top 5 cards for attachment')
            .deckSearch({
                cardsToLookAt: 5,
                cardCondition: (card) => card.type === CardType.Attachment,
                gameAction: moveCard({
                    destination: Location.Hand
                })
            })
            .effect('look at the top five cards of their deck')
            .limit(perRound(1));
    }
}
