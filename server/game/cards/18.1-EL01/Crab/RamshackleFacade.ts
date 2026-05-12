import DrawCard from '../../../drawcard';
import { Players, CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';

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
