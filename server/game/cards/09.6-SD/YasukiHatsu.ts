import DrawCard from '../../DrawCard.js';
import { CardType, Location } from '../../Constants.js';
import { moveCard } from '../../GameActions/GameActions.js';

class YasukiHatsu extends DrawCard {
    static id = 'yasuki-hatsu';

    setupCardAbilities() {
        this.action('Search top 5 cards for attachment')
            .condition(context => !!(context.source.isParticipating() && context.player.opponent && context.player.isLessHonorable()))
            .deckSearch({
                cardsToLookAt: 5,
                cardCondition: card => card.type === CardType.Attachment,
                gameAction: moveCard({
                    destination: Location.Hand
                })
            })
            .chatText('look at the top five cards of their deck');
    }
}


export default YasukiHatsu;

