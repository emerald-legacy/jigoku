import DrawCard from '../../../DrawCard.js';
import { Players, CardTypes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class RamshackleFacade extends DrawCard {
    static id = 'ramshackle-facade';

    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Holding
            }),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => card.isAttacking() && card.costLessThan(4),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}


export default RamshackleFacade;
