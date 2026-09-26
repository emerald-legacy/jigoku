import AbilityDsl from '../../abilitydsl.js';

import DrawCard from '../../DrawCard.js';
import { CardType, Location, Players } from '../../Constants.js';

class TravelingPhilospher extends DrawCard {
    static id = 'traveling-philosopher';

    setupCardAbilities() {
        this.interrupt('Flip a province facedown')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source
            })
            .target('target', {
                controller: Players.Self,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => !(card).isBroken
            }, AbilityDsl.actions.turnFacedown());
    }
}


export default TravelingPhilospher;
