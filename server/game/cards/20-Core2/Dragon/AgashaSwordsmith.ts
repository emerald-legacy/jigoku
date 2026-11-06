import { CardType, Location } from '../../../Constants.js';
import { perRound } from '../../../AbilityLimit.js';
import { moveCard } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';
import { topCards } from '../../topCards.js';

export default class AgashaSwordsmith extends DrawCard {
    static id = 'agasha-swordsmith';

    override setupCardAbilities() {
        this.action('Search top 5 cards for attachment')
            .deckSearch({
                cardsToLookAt: 5,
                cardCondition: (card) => card.type === CardType.Attachment,
                gameAction: moveCard({
                    destination: Location.Hand
                })
            })
            .chatText((context) => msg`look at the ${topCards(5, context.player.conflictDeck.length, true)} of their deck`)
            .limit(perRound(1));
    }
}
