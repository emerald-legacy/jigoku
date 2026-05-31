import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class UnleashedExperiment extends DrawCard {
    static id = 'unleashed-experiment';

    setupCardAbilities() {
        this.dire({
            effect: AbilityDsl.effects.loseAllNonKeywordAbilities()
        });

        this.persistentEffect({
            effect: AbilityDsl.effects.honorCostToDeclare(2)
        });
    }
}


export default UnleashedExperiment;
