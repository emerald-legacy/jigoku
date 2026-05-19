import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class PerfectLandBeliever extends DrawCard {
    static id = 'perfect-land-believer';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isOrdinary(),
            match: (card, context) => card === context.source,
            effect: AbilityDsl.effects.modifyBothSkills(2)
        });
    }
}


export default PerfectLandBeliever;
