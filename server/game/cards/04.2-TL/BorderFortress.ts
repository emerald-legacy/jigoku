import { CardType, Location } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../BaseCard.js';

export default class BorderFortress extends ProvinceCard {
    static id = 'border-fortress';

    setupCardAbilities() {
        this.action({
            title: 'Reveal a province',
            target: {
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isFacedown(),
                gameAction: AbilityDsl.actions.reveal({ chatMessage: true })
            },
            effect: 'reveal {1}\'s facedown province in their {2}',
            effectArgs: (context) => [(context.target as BaseCard).controller, (context.target as BaseCard).location]
        });
    }
}
