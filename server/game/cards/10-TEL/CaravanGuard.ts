import DrawCard from '../../DrawCard.js';
import { fateCostToAttack } from '../../effects.js';

class CaravanGuard extends DrawCard {
    static id = 'caravan-guard';

    setupCardAbilities() {
        this.persistentEffect({
            effect: fateCostToAttack()
        });
    }
}


export default CaravanGuard;

