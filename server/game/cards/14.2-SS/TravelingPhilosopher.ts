import { turnFacedown } from '../../GameActions/GameActions.js';

import DrawCard from '../../DrawCard.js';
import { CardType, Location, Players } from '../../Constants.js';

class TravelingPhilosopher extends DrawCard {
    static id = 'traveling-philosopher';

    setupCardAbilities() {
        this.interrupt('Flip a province facedown')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source
            })
            .target({
                controller: Players.Self,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => !card.isBroken
            }, turnFacedown());
    }
}


export default TravelingPhilosopher;
