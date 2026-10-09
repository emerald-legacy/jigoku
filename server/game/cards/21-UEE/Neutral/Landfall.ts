import { ProvinceCard } from '../../../ProvinceCard.js';
import { placeInProvinces } from '../../placeInProvinces.js';

export default class Landfall extends ProvinceCard {
    static id = 'landfall';

    setupCardAbilities() {
        this.reaction('Look at your dynasty deck')
            .when({
                onCardRevealed: (event, context) =>
                    event.card === context.source && context.player.dynastyDeck.length > 0
            })
            .handler((context) => placeInProvinces(context, context.player.dynastyDeck.slice(0, 8)))
            .chatText('look at the top 8 cards of their dynasty deck');
    }
}
