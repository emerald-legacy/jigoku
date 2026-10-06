import { CardType, Location } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { reveal } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

export default class BorderFortress extends ProvinceCard {
    static id = 'border-fortress';

    setupCardAbilities() {
        this.action('Reveal a province')
            .target({
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isFacedown()
            }, reveal({ chatMessage: true }))
            .effect((context) => msg`reveal ${context.target.controller}'s facedown province in their ${context.target.location}`);
    }
}
