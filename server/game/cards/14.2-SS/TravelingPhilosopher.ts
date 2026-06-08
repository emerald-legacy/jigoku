import AbilityDsl from '../../abilitydsl.js';

import BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import { CardType, Location, Players } from '../../Constants.js';

class TravelingPhilospher extends DrawCard {
    static id = 'traveling-philosopher';

    setupCardAbilities() {
        this.interrupt({
            title: 'Flip a province facedown',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            target: {
                controller: Players.Self,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card: BaseCard) => !(card as ProvinceCard).isBroken,
                gameAction: AbilityDsl.actions.turnFacedown()
            }
        });
    }
}


export default TravelingPhilospher;
