import DrawCard from '../../DrawCard.js';
import { CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class YasukiHatsu extends DrawCard {
    static id = 'yasuki-hatsu';

    setupCardAbilities() {
        this.action({
            title: 'Search top 5 card for attachment',
            effect: 'look at the top five cards of their deck',
            condition: context => !!(context.source.isParticipating() && context.player.opponent && context.player.isLessHonorable()),
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 5,
                cardCondition: card => card.type === CardType.Attachment,
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Location.Hand
                })
            })
        });
    }
}


export default YasukiHatsu;

