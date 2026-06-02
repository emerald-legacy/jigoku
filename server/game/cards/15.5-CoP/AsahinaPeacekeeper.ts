import DrawCard from '../../DrawCard.js';
import { Players, CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AsahinaPeacekeeper extends DrawCard {
    static id = 'asahina-peacekeeper';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Any,
            targetLocation: Location.PlayArea,
            match: card => card.getType() === CardType.Character,
            effect: AbilityDsl.effects.cardCostToAttackMilitary(1)
        });
    }
}


export default AsahinaPeacekeeper;
