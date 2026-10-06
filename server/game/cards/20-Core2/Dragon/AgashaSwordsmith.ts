import { CardType, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { deckSearch, moveCard } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class AgashaSwordsmith extends DrawCard {
    static id = 'agasha-swordsmith';

    setupCardAbilities() {
        this.action('Search top 5 cards for attachment')
            .gameAction(deckSearch({
                amount: 5,
                cardCondition: (card) => card.type === CardType.Attachment,
                gameAction: moveCard({
                    destination: Location.Hand
                })
            }))
            .effect('look at the top five cards of their deck')
            .limit(AbilityDsl.limit.perRound(1));
    }
}
