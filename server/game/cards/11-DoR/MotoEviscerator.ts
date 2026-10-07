import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class MotoEviscerator extends DrawCard {
    static id = 'moto-eviscerator';

    setupCardAbilities() {
        this.action('Move this character to conflict')
            .cost(AbilityDsl.costs.payHonor(1))
            .moveToConflict();
    }
}


export default MotoEviscerator;
