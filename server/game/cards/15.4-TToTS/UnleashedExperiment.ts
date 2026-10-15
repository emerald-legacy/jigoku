import DrawCard from '../../DrawCard.js';
import { honorCostToDeclare, loseAllNonKeywordAbilities } from '../../effects.js';

class UnleashedExperiment extends DrawCard {
    static id = 'unleashed-experiment';

    setupCardAbilities() {
        this.dire({
            effect: loseAllNonKeywordAbilities()
        });

        this.persistentEffect({
            effect: honorCostToDeclare({
                amount: 2
            })
        });
    }
}


export default UnleashedExperiment;
