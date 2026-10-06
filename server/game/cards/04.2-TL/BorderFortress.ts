import { CardType, Location } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { reveal } from '../../GameActions/GameActions.js';

export default class BorderFortress extends ProvinceCard {
    static id = 'border-fortress';

    setupCardAbilities() {
        this.action('Reveal a province')
            .target({
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isFacedown()
            }, reveal({ chatMessage: true }))
            .effect('reveal {1}\'s facedown province in their {2}', (context) => [context.target.controller, context.target.location]);
    }
}
