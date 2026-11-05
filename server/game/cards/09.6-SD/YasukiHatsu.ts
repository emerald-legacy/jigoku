import DrawCard from '../../DrawCard.js';
import { CardType, Location } from '../../Constants.js';
import { moveCard } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';
import { topCards } from '../topCards.js';

class YasukiHatsu extends DrawCard {
    static id = 'yasuki-hatsu';

    override setupCardAbilities() {
        this.action('Search top 5 cards for attachment')
            .condition((context) => context.source.isParticipating())
            .ifCondition((context) => !!context.player.opponent && context.player.isLessHonorable())
            .deckSearch({
                cardsToLookAt: 5,
                cardCondition: (card) => card.type === CardType.Attachment,
                gameAction: moveCard({
                    destination: Location.Hand
                })
            })
            .chatText((context) => msg`look at the ${topCards(5, context.player.conflictDeck.length, true)} of their deck`);
    }
}


export default YasukiHatsu;

