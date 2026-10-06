import DrawCard from '../../DrawCard.js';
import { Players, CardType, Location } from '../../Constants.js';
import { cardCostToAttackMilitary } from '../../effects.js';

class AsahinaPeacekeeper extends DrawCard {
    static id = 'asahina-peacekeeper';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Any,
            targetLocation: Location.PlayArea,
            match: card => card.getType() === CardType.Character,
            effect: cardCostToAttackMilitary(1)
        });
    }
}


export default AsahinaPeacekeeper;
