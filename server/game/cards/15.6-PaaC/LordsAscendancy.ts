import { msg } from '../../GameChat.js';
import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { placeFate } from '../../GameActions/GameActions.js';

export default class LordsAscendancy extends ProvinceCard {
    static id = 'lord-s-ascendancy';

    setupCardAbilities() {
        this.action('Place a fate on a character')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, placeFate((context) => ({
                origin: context.target.controller
            })))
            .chatText((context) => msg`place a fate from ${context.target.controller}'s fate pool on ${context.chatTarget()}`);
    }
}
