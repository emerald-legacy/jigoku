import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class CaravanGuard extends DrawCard {
    static id = 'caravan-guard';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.fateCostToAttack()
        });
    }
}


export default CaravanGuard;

