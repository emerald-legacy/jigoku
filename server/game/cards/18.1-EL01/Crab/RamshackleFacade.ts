import DrawCard from '../../../DrawCard.js';
import { Players, CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class RamshackleFacade extends DrawCard {
    static id = 'ramshackle-facade';

    setupCardAbilities() {
        this.action('Bow a character')
            .cost(AbilityDsl.costs.sacrifice({
                cardType: CardType.Holding
            }))
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: card => card.isAttacking() && card.costLessThan(4)
            }, AbilityDsl.actions.bow());
    }
}


export default RamshackleFacade;
