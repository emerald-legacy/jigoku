import { ProvinceCard } from '../../../ProvinceCard.js';
import { placeInProvinces } from '../../placeInProvinces.js';
import { msg } from '../../../GameChat.js';
import { topCards } from '../../topCards.js';

export default class Landfall extends ProvinceCard {
    static id = 'landfall';

    override setupCardAbilities() {
        this.reaction('Look at your dynasty deck')
            .when({
                onCardRevealed: (event, context) =>
                    event.card === context.source && context.player.dynastyDeck.length > 0
            })
            .handler((context) => placeInProvinces(context, context.player.dynastyDeck.slice(0, 8)))
            .chatText((context) => msg`look at the ${topCards(8, context.player.dynastyDeck.length)} of their dynasty deck`);
    }
}
